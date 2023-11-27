const AppError = require("../utils/appError.util").default;
const { CLIENT_ERROR_MESSAGE } = require("../constants/config.constant");
const Restaurant = require("../models/restaurant.model");
const Menu = require("../models/menu.model");
const Tag = require("../models/tag.model");
const User = require("../models/user.model");
const PersonalConfig = require("../models/personal-config.model");
const crypto = require("crypto");
const { splitTagName } = require("../utils/helper.util");
/**
 * @description Here is example of controller function
 * @todo write logic here, inside the try block
 * AppError is custom error for foodie finder. It has 4 parameters
 * <ul>
 * <li><code> statusCode</code>: HTTP status code </li>
 * <li><code> status</code>: either fail or success </li>
 * <li><code> errorCode</code>: error code send back to FE team. By this error,
 * fe dev can easily find out the cause of error </li>
 * <li><code> message</code>: message that describe console.error(); </li>
 * </ul>
 *
 * incase we want to create an error, we should throw AppError instance.
 * By throw an error, we automatically delegate the handling exception to GlobalErrorController
 *
 */

var slugify = require("slugify");

exports.getSth = async (req, res, next) => {
  try {
    // if (true) {
    //   throw new AppError(401, "fail", "ERR_LOGIN_2", CLIENT_ERROR_MESSAGE.ERR_LOGIN_2)
    // }

    // successful response
    res.status(200).send({
      message: "Test route",
    });
  } catch (err) {
    next(err);
  }
};

exports.initPersonalConfig = async function (req, res, next) {
  try {
    User.find({}, (err, documents) => {
      if (err) {
        next(err);
      }
      documents.forEach(async (doc) => {
        const userId = doc._id;
        var config = {
          userId,
        };
        await PersonalConfig.create(config);
      });
    });

    res.status(200).send({
      message: "All done!!!",
    });
  } catch (err) {
    next(err);
  }
};

exports.buildTagSystem = async function (req, res, next) {
  try {
    Restaurant.find({}, (err, documents) => {
      if (err) {
        next(err);
      }
      documents.forEach(async (doc) => {
        const menuId = doc.resMenuInfor;
        const menu = await Menu.findById(menuId);
        // console.log("menu: " + menu)
        const tagsByMenuItem = menu.items.map((item) => {
          const tagName = slugify(item.name, {
            replacement: "-", // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            // strict: false, // strip special characters except replacement, defaults to `false`
            locale: "vi", // language code of the locale to use
            trim: true, // trim leading and trailing replacement chars, defaults to `true`
          });
          return {
            name: tagName,
            desc: item.name,
          };
        });
        // console.log(tagsByMenuItem)
        Tag.insertMany(tagsByMenuItem, async (err, tags) => {
          await Restaurant.findOneAndUpdate(
            { _id: doc._id },
            {
              tags: tags,
            }
          );
        });
      });
    });

    res.status(200).send({
      message: "All done!!!",
    });
  } catch (err) {
    next(err);
  }
};

exports.slugifyRestaurant = async (req, res, next) => {
  try {
    await this.updateTagsOfRestaurant({});

    res.status(200).send({
      message: "All done!!!",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTagsOfRestaurant = async (query) => {
  try {
    Restaurant.find(query, async (err, documents) => {
      if (err) {
        throw err;
      }
      for (const doc of documents) {
        const menuId = doc.resMenuInfor;
        const menu = await Menu.findById(menuId);
        const tagsByMenuItem = menu.items.map((item) => {
          const tagName = slugify(item.name, {
            replacement: "-", // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            // strict: false, // strip special characters except replacement, defaults to `false`
            locale: "vi", // language code of the locale to use
            trim: true, // trim leading and trailing replacement chars, defaults to `true`
          });
          return {
            name: splitTagName(tagName).join("-"),
            desc: item.name,
          };
        });
        Tag.insertMany(tagsByMenuItem, async (err, tags) => {
          await Restaurant.findOneAndUpdate(
            { _id: doc._id },
            {
              tags: tags,
            }
          );
        });
      }
      return;
    });
  } catch (err) {
    throw err;
  }
};
