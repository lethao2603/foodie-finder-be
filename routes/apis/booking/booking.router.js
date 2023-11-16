const express = require('express');
const routeAPI = express.Router({mergeParams: true});
const BookingController = require("../../../controllers/booking/booking.controller");
const authController = require("../../../controllers/auth.controller");

//routerAPI
routeAPI.use(authController.protect);

routeAPI.post('/', authController.restrictTo('customer'), BookingController.postCreateBooking);
routeAPI.get('/', BookingController.getAllBooking);

// Confirm Booking
routeAPI.patch('/:bookingId/confirm',
    authController.restrictTo('restaurant-owner'), BookingController.patchBookingConfirm);

routeAPI.use(authController.restrictTo('customer'));

routeAPI.get('/:id', BookingController.getBookingById);
routeAPI.patch('/:id', BookingController.patchUpdateBooking);
routeAPI.delete('/:id', BookingController.deleteDelBooking);

module.exports = routeAPI;