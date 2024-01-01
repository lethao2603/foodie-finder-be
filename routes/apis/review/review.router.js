const express = require('express');
const routeAPI = express.Router({mergeParams: true});
const reviewController = require("../../../controllers/review/review.controller");
const authController = require('../../../controllers/auth.controller');

//routerAPI


routeAPI.get('/restaurant/:resId', reviewController.getAllReview);
routeAPI.use(authController.protect)
routeAPI.get('/my-review', reviewController.getMyReview);
routeAPI.post('/', authController.restrictTo('customer'), reviewController.postCreateReview);

routeAPI.patch('/:id', 
    authController.restrictTo('customer', 'admin'), 
    reviewController.patchUpdateReview);
routeAPI.delete('/:id', 
    authController.restrictTo('customer', 'admin'), 
    reviewController.deleteReview);
 
module.exports = routeAPI;