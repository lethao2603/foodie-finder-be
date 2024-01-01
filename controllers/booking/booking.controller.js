const useServices = require("../../services/booking/bookingServices");
const Booking = require("../../models/booking.model");
const socketIO = require("../../libs/socket.lib");
const { extractUserIdFromToken } = require("../../utils/auth.util");
exports.postCreateBooking = async (req, res) => {
  try {
    //Allow nested routes
    // if (!req.body.restaurant) req.body.resInfor = req.params.resId;
    // if (!req.body.customer) req.body.cusInfor = req.user.id;
    const { customerName, email, phoneNumber, date, time, numberOfPeople, resInfor, cusInfor } = req.body;
    const data = { customerName, email, phoneNumber, date, time, numberOfPeople, resInfor, cusInfor };
    let result = await useServices.createBooking(data);
    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getPendingBooking = async (req, res) => {
  try {
    const result = await Booking.find({ status: "pending" });
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.respondToBookingRequest = async (req, res) => {
  try {
    const { bookingId, action } = req.body;
    const validActions = ["accept", "reject"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (action === "accept") {
      booking.status = "accepted";
    } else {
      booking.status = "rejected";
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await useServices.bookingById(id);
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

exports.getAllBooking = async (req, res) => {
  try {
    let filter = {};
    if (req.params.resId) filter = { resInfor: req.params.resId };
    let result = await useServices.allBooking(filter);
    return res.status(200).json({
      status: "success",
      results: result.length,
      total_page: Math.ceil(result.length / 10),
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.patchUpdateBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    let result = await useServices.updateBooking(id, updatedData);
    return res.status(200).json({
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

exports.deleteDelBooking = async (req, res) => {
  try {
    await useServices.deleteBooking(req.params.id);
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

exports.getBookingByCustomerId = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const userId = extractUserIdFromToken(accessToken);
    let filter = {};
    if (req.params.resId) filter = { resInfor: req.params.resId };
    let result = await useServices.allBookingsByCustomer(userId, filter);
    return res.status(200).json({
      status: "success",
      results: result.length,
      total_page: Math.ceil(result.length / 10),
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
