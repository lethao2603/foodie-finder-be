const useServices = require("../../services/review/reviewServices");
const GlobalConfig = require("../../models/global-config.model");
const { Worker } = require("worker_threads");
exports.postCreateReview = async (req, res) => {
  try {
    const { cusInfor, resInfor } = req.body;
    const userBooking = await useServices.getUserBooking(cusInfor, resInfor);
    if (!userBooking) {
      return res.status(403).json({
        status: "fail",
        message: "You need to place an booking at the restaurant before posting a review.",
      });
    }

    // if (!req.body.restaurant) req.body.resInfor = req.params.resId;
    // if (!req.body.customer) req.body.cusInfor = req.user.id;

    let result = await useServices.createReview(req.body);
    // Calling update rcm data frame API when there is a new review was added to the system
    const worker = new Worker("./workers/update-rcm-model.js");
    worker.on("message", async (data) => {
      console.log(data);
      const x = await GlobalConfig.findOneAndUpdate(
        { name: "recommendation_config" },
        { $inc: { rcmDataframeVersion: 1 } },
        { useFindAndModify: false }
      );
    });

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getAllReview = async (req, res) => {
  try {
    let filter = {};
    if (req.params.resId) filter = { resInfor: req.params.resId };

    let result = await useServices.getReview(filter);
    return res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.patchUpdateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    let result = await useServices.updateReview(id, updatedData);
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await useServices.delReview(req.params.id);
    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getMyReview = async (req, res) => {
  try {
    const reviews = await useServices.getMyReview(req.user._id);

    return res.status(200).json({
      status: "success",
      results: reviews.length,
      total_page: Math.ceil(reviews.length / 10),
      data: reviews,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
