const useServices = require("../../services/booking/bookingServices")

exports.postCreateBooking = async (req, res) => {
    try {
        let result = await useServices.createBooking(req.body);
        return res.status(201).json(
            {
                status: 'success',
                data: result
            });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        let result = await useServices.bookingById(id);
        return res.status(200).json(
            {
                status: 'success',
                data: result
            });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.getAllBooking = async (req, res) => {
    try {
        let result = await useServices.allBooking(req.query);
        return res.status(200).json(
            {
                status: 'success',
                results: result.length,
                data: result
            });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.patchUpdateBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        let result = await useServices.updateBooking(id, updatedData);
        return res.status(200).json(
            {
                status: 'success',
                data: null
            })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.deleteDelBooking = async (req, res) => {
    try {
        await useServices.deleteBooking(req.params.id);
        return res.status(204).json(
            {
                status: 'success',
                data: null
            });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};