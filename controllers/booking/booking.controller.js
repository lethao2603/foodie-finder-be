const useServices = require("../../services/booking/bookingServices")
const Booking = require("../../models/booking.model");
const socketService = require('../../libs/socket.lib');

exports.postCreateBooking = async (req, res) => {
    try {
         //Allow nested routes
        if(!req.body.restaurant) req.body.resInfor = req.params.resId;
        if(!req.body.customer) req.body.cusInfor = req.user.id; 

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

exports.patchBookingConfirm = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        // Tìm đơn đặt bàn trong cơ sở dữ liệu
        const findBooking = await Booking.findById(bookingId);

        // Kiểm tra xem đơn đặt bàn có tồn tại hay không
        if (findBooking) {
            findBooking.status = true;

            // Lưu thông tin đơn đặt bàn đã cập nhật vào cơ sở dữ liệu
            await findBooking.save();

            // Thông báo cho khách hàng với Socket.IO
            socketService.emitBookingConfirmedEvent(bookingId, 'Đơn đặt bàn của bạn đã được chấp nhận', bookingId );

            res.json({ status: true });
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        let filter = {};
        if(req.params.resId) 
            filter = { resInfor: req.params.resId};
        let result = await useServices.allBooking(filter);
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