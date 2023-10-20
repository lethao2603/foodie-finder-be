const Booking = require("../../models/booking.model")

module.exports = {
    createBooking: async (data) => {
        let result = await Booking.create(data);
        return result;
    }
}