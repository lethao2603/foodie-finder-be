const useServices = require("../../services/booking/bookingServices")

module.exports = {
    postCreateBooking: async (req, res) => {
        let result = await useServices.createBooking(req.body);
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    }
}