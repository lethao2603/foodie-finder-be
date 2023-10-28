const express = require('express');

const routeAPI = express.Router();

const reviewController = require("../../../controllers/review/review.controller");

//routerAPI
routeAPI.get('/', reviewController.getAllReview);
routeAPI.post('/create', reviewController.postCreateReview);
routeAPI.put('/update', reviewController.putUpdateReview);
routeAPI.delete('/delete', reviewController.deleteReview);

module.exports = routeAPI;