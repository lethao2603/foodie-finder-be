const Booking = require("../../models/booking.model");
const APIFeatures = require("../../utils/apiFeatures");

exports.createBooking = async (data) => {
    let result = await Booking.create(data);
    return result;
};

exports.bookingById = async (id) => {
    let result = await Booking.findById(id);
    return result;
};

exports.allBooking = async (queryString) => {
    //EXECUTE QUERY
    const features = new APIFeatures(Booking.find(), queryString)
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