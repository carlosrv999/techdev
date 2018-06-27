var db = require('../config/db');
const uuidv4 = require('uuid/v4');
const dsParkingService = require('../datasource/parkingservice.datasource');

exports.updateService = async(req,res) => {
  try {
    let result = await dsParkingService.updateService(db, req.params.id, req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}