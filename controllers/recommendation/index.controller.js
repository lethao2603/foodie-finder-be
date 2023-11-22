const Restaurant = require("../../models/restaurant.model");
const PersonalConfig = require("../../models/personal-config.model");
const { JWT_SECRET_KEY } = require("../../constants/config.constant");
const jwt = require("jsonwebtoken");
var slugify = require("slugify");

exports.updateUserPreferences = async function (req, res, next) {
  try {
    const accessToken = req.headers.authorization;
    const accessTokenArray = accessToken.split(" ");
    const { categories } = req.body;
    if (accessTokenArray.length === 1 || accessTokenArray[0] !== "Bearer")
      return res.status(400).json({ message: "Your token have wrong key" });
    const verify = jwt.verify(accessTokenArray[1], JWT_SECRET_KEY);

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
    // console.log(verify.id);
    // console.log(updatedPreferences);
    const doc = await PersonalConfig.findOneAndUpdate(
      { userId: verify.id },
      {
        // firstTimeLogin: false,
        preferences: updatedPreferences,
      },
      {
        new: true,
      }
    );
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
    const accessTokenArray = accessToken.split(" ");
    if (accessTokenArray.length === 1 || accessTokenArray[0] !== "Bearer")
      return res.status(400).json({ message: "Your token have wrong key" });
    const verify = jwt.verify(accessTokenArray[1], JWT_SECRET_KEY);

    const personalConfig = await PersonalConfig.findOne({ userId: verify.id });
    const slugs = personalConfig.preferences.values;
    const result = await Restaurant.find({ typeOfRes: { $in: slugs } })
      .sort({ pointEvaluation: -1 })
      .limit(numOfItems);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopNRecommendedBasedOnClickHistory = async function (req, res, next) {};
