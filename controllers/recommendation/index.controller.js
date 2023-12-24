const Restaurant = require("../../models/restaurant.model");
const PersonalConfig = require("../../models/personal-config.model");
const { JWT_SECRET_KEY } = require("../../constants/config.constant");
const { extractUserIdFromToken } = require("../../utils/auth.util");
const Tag = require("../../models/tag.model");
const jwt = require("jsonwebtoken");
var slugify = require("slugify");
const { splitTagName } = require("../../utils/helper.util");
const mongoose = require("mongoose");

exports.updateUserPreferences = async function (req, res, next) {
  try {
    const accessToken = req.headers.authorization;
    const { categories } = req.body;
    const userId = extractUserIdFromToken(accessToken);
    if (!userId) {
      return res.status(400).json({ message: "Your token have wrong key" });
    }
    const slugs = categories.map((category) =>
      slugify(category, {
        replacement: "_", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        // strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      })
    );

    const updatedPreferences = {
      values: [...slugs],
      enabled: true,
    };
    const doc = await PersonalConfig.findOneAndUpdate(
      { userId: userId },
      {
        firstTimeLogin: false,
        preferences: updatedPreferences,
      },
      {
        new: true,
      }
    );
    // console.log("new preferences: ", doc);
    return res.status(200).json({
      status: "success",
      data: doc,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopNRecommendedBasedOnUserPreferences = async function (req, res, next) {
  try {
    const numOfItems = Number.parseInt(req.query.numOfItems);
    const accessToken = req.headers.authorization;
    const userId = extractUserIdFromToken(accessToken);
    if (!userId) {
      return res.status(400).json({ message: "Your token have wrong key" });
    }

    const personalConfig = await PersonalConfig.findOne({ userId: userId });
    const slugs = personalConfig.preferences.values;
    console.log(slugs);
    const result = await Restaurant.find({ typeOfRes: { $in: slugs } })
      .sort({ pointEvaluation: -1 })
      .limit(100);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {}
};

exports.getTopNRecommendedBasedOnSearchHistory = async function (req, res, next) {
  try {
    const accessToken = req.headers.authorization;
    const userId = extractUserIdFromToken(accessToken);
    const personalConfig = await PersonalConfig.findOne({ userId: userId });
    const searchHistory = personalConfig.searchHistory.values
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .map((elm) => elm.restaurantId);
    let promises = searchHistory.map((elm) => getSimilarRestaurantsByTags(elm));
    const results = await Promise.all(promises);
    // ====> results = [[array of restaurant that similar to search history 1], [array of .. history 2], []]
    let uniqueResult = [];
    for (let i = 0; i < results.length; i++) {
      uniqueResult = [...uniqueResult, ...distinctRestaurantsBySlug(results[i])];
    }
    // ====> uniqueResult = [... similar history 1, ... similar history 2, ... similar history 3]
    return res.status(200).json({
      status: "success",
      data: distinctRestaurantsBySlug(uniqueResult),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSearchHistory = async function (userId, restaurantId) {
  try {
    const userConfig = await PersonalConfig.findOne({ userId: userId });
    const lastSearchedItems = userConfig.searchHistory.values; // [{restaurantId, time}]
    const maxItems = userConfig.searchHistory.maxItems;
    const existingIdx = lastSearchedItems.findIndex((item) => item.restaurantId === restaurantId);
    let newSearchHistory = [];
    if (existingIdx != -1) {
      lastSearchedItems[existingIdx] = {
        restaurantId,
        time: Date.now(),
      };
      newSearchHistory = [...lastSearchedItems];
    } else {
      lastSearchedItems.unshift({
        restaurantId,
        time: Date.now(),
      });
      newSearchHistory = lastSearchedItems.slice(0, maxItems);
    }
    const _ = await PersonalConfig.findOneAndUpdate(
      { userId: userId },
      {
        searchHistory: {
          values: newSearchHistory,
          enabled: true,
        },
      }
    );
    return;
  } catch (err) {
    throw err;
  }
};

exports.updateReviewDataset = async (req, res, next) => {
  try {
  } catch (err) {
    throw err;
  }
};

async function getSimilarRestaurantsByTags(restaurantId) {
  try {
    const restaurant = await Restaurant.findById(restaurantId).populate("tags");

    const tags = restaurant.tags;
    // combo-69k-banh-canh-cua-gia-truyen-ngon

    const normalizedTags = tags
      .map((tag) => splitTagName(tag.name).slice(0, 3).join("-"))
      .filter((tag, idx, self) => {
        return idx == self.indexOf(tag);
      })
      .filter((tag) => tag.length > 3);

    // let result = [];
    // console.log(normalizedTags);
    const promises = normalizedTags.map((tag) => findSimilarRestaurantsByTagName(tag));
    const result = await Promise.all(promises);
    // ====> result = [[Fn(tag1), Fn(tag2)], [Fn(tag3), Fn(tag4)]]

    let data = [];
    for (let i = 0; i < result.length; i++) {
      data = [...data, ...distinctRestaurantsBySlug(result[i])];
    }
    // ====> data = [fn(tag1), fn(tag2), fn(tag3), fn(tag4) ]
    return distinctRestaurantsBySlug(data);
    // ====> distinct 1 lan nua để lọc giá trị trùng nhau
  } catch (err) {
    return [];
  }
}

async function findSimilarRestaurantsByTagName(tagName) {
  try {
    const result = await Restaurant.aggregate([
      // {
      //   $unwind: "$tags",
      // },
      {
        $lookup: {
          from: Tag.collection.name,
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $match: {
          "tags.name": new RegExp(`^${tagName}`, "i"),
        },
      },
      {
        $project: { tags: 0 },
      },
    ]).exec();
    return result;
  } catch (err) {
    return [];
  }
}

function distinctRestaurantsBySlug(restaurants) {
  var unique = {};
  var distinct = [];
  for (let i = 0; i < restaurants.length; i++) {
    if (!unique[restaurants[i]?.slug]) {
      distinct.push(restaurants[i]);
      unique[restaurants[i].slug] = 1;
    }
  }
  // console.log(distinct);
  return distinct;
}
