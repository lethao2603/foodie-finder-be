const Booking = require("../../models/booking.model");
const APIFeatures = require("../../utils/apiFeatures");
const socketIO = require('../../libs/socket.lib');

exports.createBooking = async (data) => {
    let result = await Booking.create(data);
    // Thông báo cho chủ nhà hàng với Socket.IO
    socketIO.sendOrderNotification(result);
    return result;
};

exports.bookingById = async (id) => {
    let result = await Booking.findById(id);
    return result;
};

exports.allBooking = async (filter) => {
    //EXECUTE QUERY
    const features = new APIFeatures(Booking.find(), filter)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const result = await features.query;
    return result;
};

exports.updateBooking = async (id, data) => {
    let result = await Booking.updateOne({ _id: id }, { $set: data });
    return result;
};

exports.deleteBooking = async (id) => {
    let result = await Booking.deleteById(id);
    return result;
};