const express = require('express');
const routeAPI = express.Router();
const BookingController = require("../../../controllers/booking/booking.controller");
const authController = require("../../../controllers/auth.controller");

//routerAPI
routeAPI.use(authController.protect);
routeAPI.use(authController.restrictTo('admin'));

routeAPI.post('/', BookingController.postCreateBooking);
routeAPI.get('/', BookingController.getAllBooking);

routeAPI.get('/:id', BookingController.getBookingById);
routeAPI.patch('/:id', BookingController.patchUpdateBooking);
routeAPI.delete('/:id', BookingController.deleteDelBooking);

module.exports = routeAPI;