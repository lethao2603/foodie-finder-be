const express = require('express');
const routeAPI = express.Router();
const reviewController = require("../../../controllers/review/review.controller");
const authController = require('../../../controllers/auth.controller');

//routerAPI
routeAPI.get('/', reviewController.getAllReview);
routeAPI.post('/',
    authController.protect,
    authController.restrictTo('user'),
    reviewController.postCreateReview);
routeAPI.put('/update', reviewController.putUpdateReview);
routeAPI.delete('/delete', reviewController.deleteReview);
 
module.exports = routeAPI;