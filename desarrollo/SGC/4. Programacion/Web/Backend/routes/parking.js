var express = require('express');
var router = express.Router();
var Parking = require('../controllers/parking.controller');

const parkingSchemas = require('../controllers/schemas/parking.schema');
const validator = require('../controllers/schemas/validate');

/* GET home page. */
router.get('/nearby', Parking.getNearby);
router.post('/', validator.middlewareRequestValidation.bind(null, parkingSchemas.createSchema), Parking.create);
router.post('/login', Parking.login);
router.get('/byCompany', Parking.getParkingsByCompany);
router.get('/search', Parking.getParkingsByCompanyByName);
router.get('/countByCompany', Parking.getCountParkingsByCompany);
router.get('/countByCompanyByName', Parking.getCountParkingsByCompanyByName);
router.get('/from-company', Parking.getAllParkingsByCompany);
router.get('/:id', Parking.getParkingById);
router.get('/:id/services', Parking.getServices);
router.post('/:id/services', Parking.createService);
router.get('/:id/notUsedServices', Parking.getNotUsedServices);
router.patch('/:id', validator.middlewareRequestValidation.bind(null, parkingSchemas.updateSchema), Parking.updateParking);

module.exports = router;