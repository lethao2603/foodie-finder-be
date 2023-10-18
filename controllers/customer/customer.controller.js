const User = require("../../models/user.model");
const Token = require("../../models/token.model");
const AppError = require("../../utils/appError.util");
exports.verifyLink = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      throw new AppError(404, "fail", undefined, "Invalid link");
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      throw new AppError(404, "fail", undefined, "Invalid link");
    }
    await User.updateOne({ _id: user._id, verified: true });
    await token.remove();

    res.status(200).send({
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
