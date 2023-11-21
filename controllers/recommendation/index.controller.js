const Restaurant = require("../../models/restaurant.model");
var slugify = require("slugify");

exports.getTopNRecommendedBasedOnUserPreferences = async function (req, res, next) {
  try {
    const { itemCount, categories } = req.body;
    ['banh_xeo', 'pizza', 'bbq']
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
    const result = await Restaurant.find({ typeOfRes: {"$in": slugs} }).sort({ pointEvaluation: -1 }).limit(itemCount);
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopNRecommendedBasedOnClickHistory = async function (req, res, next) {};
