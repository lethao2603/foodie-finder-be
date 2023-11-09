const express = require('express');
const routeAPI = express.Router({mergeParams: true});
const reviewController = require("../../../controllers/review/review.controller");
const authController = require('../../../controllers/auth.controller');

//routerAPI
routeAPI.use(authController.protect)

routeAPI.get('/', reviewController.getAllReview);
routeAPI.post('/', authController.restrictTo('customer'), reviewController.postCreateReview);

routeAPI.patch('/:id', 
    authController.restrictTo('customer', 'admin'), 
    reviewController.patchUpdateReview);
routeAPI.delete('/:id', 
    authController.restrictTo('customer', 'admin'), 
    reviewController.deleteReview);
 
module.exports = routeAPI;