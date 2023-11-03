const express = require('express');
const routeAPI = express.Router();
const reviewController = require("../../../controllers/review/review.controller");
const authController = require('../../../controllers/auth.controller');

//routerAPI
routeAPI.get('/', reviewController.getAllReview);
// chưa xử lí hàm authController.protect, authController.restricTo('user'),
routeAPI.post('/create',//authController.protect, authController.restricTo('user'),
    reviewController.postCreateReview);
routeAPI.put('/update', reviewController.putUpdateReview);
routeAPI.delete('/delete', reviewController.deleteReview);

module.exports = routeAPI;