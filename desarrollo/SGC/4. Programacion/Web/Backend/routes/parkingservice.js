var express = require('express');
var router = express.Router();
var ParkingService = require('../controllers/parkingservice.controller');

const parkingSchemas = require('../controllers/schemas/parking.schema');
const validator = require('../controllers/schemas/validate');

router.patch('/:id', validator.middlewareRequestValidation.bind(null, parkingSchemas.updateService), ParkingService.updateService)

module.exports = router;