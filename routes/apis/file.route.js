const express = require('express');

const routeAPI = express.Router();

const fileController = require("../../controllers/file.controllers")

routeAPI.post('/', fileController.postUploadSingleFileAPI)
routeAPI.post('/many', fileController.postUploadMultipleFilesAPI)

module.exports = routeAPI;