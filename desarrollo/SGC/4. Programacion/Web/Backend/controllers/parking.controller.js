var db = require('../config/db');
const uuidv4 = require('uuid/v4');
const dsParking = require('../datasource/parking.datasource');
const dsParkingService = require('../datasource/parkingservice.datasource');
const dsLocation = require('../datasource/location.datasource');
const dsUser = require('../datasource/user.datasource');
const constants = require('../config/constants');

const userParkingType = 2;
const userCompanyType = 1;

exports.login = async (req, res) => {
  try {
    let result = await dsUser.login(db, req.body.email, req.body.password, userParkingType);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
}

exports.getNearby = async (req, res) => {
  try {
    if (!req.query.lat || !req.query.lng) {
      return res.status(500).send({
        err: "query param [lat] or [lng] missing"
      });;
    }
    let resp = await dsParking.getNearbyParkings(req.query.lat, req.query.lng);
    return res.status(200).send(resp);
  } catch (error) {
    return res.status(500).send(error);
  }
}

exports.create = async (req, res) => {
  let client;
  try {
    client = await db.pool.connect();
    await client.query('BEGIN');
    let insertUser = await dsUser.create(client, req.body, userParkingType);
    let insertLocation = await dsLocation.create(client, req.body.coordinates);
    let insertParking = await dsParking.create(client, req.body, insertUser.id, insertLocation.id);
    let insertParkingService = await dsParkingService.create(client, insertParking.id, constants.ID_PARKING_RENTALSERVICE, req.body.cost_hour);
    await client.query('COMMIT');
    insertParking.location = insertLocation;
    client.release();
    return res.status(200).send({
      insertUser: insertUser,
      insertLocation: insertLocation,
      insertParking: insertParking,
      insertParkingService: insertParkingService
    });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }
    return res.status(500).send(err);
  }
}

exports.getParkingsByCompany = async (req, res) => {
  try {
    if (!req.query.id_company) return res.status(500).send({ err: 'id_company no especificado' });
    let limit = Number.parseInt(req.query.limit);
    let page = Number.parseInt(req.query.page);
    if (typeof limit != 'number' || typeof page != 'number') {
      return res.status(500).send({
        msg: 'el parametro limit o page no corresponden'
      });
    }
    let result = await dsParking.getParkingsEmployeesServicesByCompany(db, req.query.id_company, limit, page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getParkingsByCompanyByName = async (req, res) => {
  try {
    if (!req.query.id_company || !req.query.name) return res.status(500).send({ err: 'id_company o name de busqueda no especificado' });
    let limit = Number.parseInt(req.query.limit);
    let page = Number.parseInt(req.query.page);
    let name = req.query.name.toString();
    if (typeof limit != 'number' || typeof page != 'number' || typeof name != 'string') {
      return res.status(500).send({
        msg: 'el parametro limit o page o name no corresponden'
      });
    }
    let result = await dsParking.getParkingsEmployeesServicesByCompanyByName(db, req.query.id_company, limit, page, name);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getCountParkingsByCompany = async (req, res) => {
  try {
    if (!req.query.id_company) return res.status(500).send({ err: 'id_company no especificado' });
    let result = await dsParking.getParkingsCountByCompany(db, req.query.id_company);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.getCountParkingsByCompanyByName = async (req, res) => {
  try {
    if (!req.query.id_company || !req.query.name) return res.status(500).send({ err: 'id_company o name no especificado' });
    let result = await dsParking.getParkingSearchByNameCount(db, req.query.id_company, req.query.name);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.updateParking = async (req, res) => {
  let client;
  try {
    client = await db.pool.connect();
    await client.query('BEGIN');
    let parkingInstance = await dsParking.getParkingById(client, req.params.id);
    if(parkingInstance) {
      let result = {};
      if(req.body.coordinates) {
        let updatedLocation = await dsLocation.updateById(client, parkingInstance.id_location, req.body.coordinates);
        result.updatedLocation = updatedLocation;
        delete req.body.coordinates;
      }
      if(req.body.email) {
        let updatedUser = await dsUser.updateUserEmail(client, parkingInstance.id_user, req.body.email);
        result.updatedUser = updatedUser;
        delete req.body.email;
      }
      if(
        req.body.address ||
        req.body.capacity ||
        req.body.id_employee ||
        req.body.status ||
        req.body.phone_number ||
        req.body.name
      ) {
        let updatedParking = await dsParking.updateParking(client, req.params.id, req.body);
        result.updatedParking = updatedParking;
      }
      await client.query('COMMIT');
      client.release();
      return res.status(200).send({
        msg: 'success',
        result: result
      });
    } else {
      return res.status(500).send({
        err: 'id de parking no existe'
      });
    }
  } catch (error) {
    if(client) {
      await client.query('ROLLBACK');
      client.release();
    }
    res.status(500).send(error);
  }
}