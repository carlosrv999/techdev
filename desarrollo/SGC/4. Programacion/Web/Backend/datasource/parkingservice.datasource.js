const pg = require('knex')({ client: 'pg' });
const db = require('../config/db');
const uuidv4 = require('uuid/v4');

exports.create = (client, id_parking, id_service, cost_hour) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insertValues = {
        id: uuidv4(),
        id_parking: id_parking,
        id_service: id_service,
        cost_hour: cost_hour
      }
      let query = pg('parking_service').insert(insertValues).returning('*').toString();
      let result = await client.query(query);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getServicesFromParking = (client, id_parking) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = 'select PS.*, S.NAME from PARKING_SERVICE PS join SERVICE S on PS.id_service = S.id where id_parking = $1';
      let values = [id_parking];
      let result = await client.query(query, values);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.createService = (client, id_parking, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let submitValues = {
        ...body,
        id: uuidv4(),
        id_parking: id_parking,
        status: true
      }
      const query = pg('parking_service').insert(submitValues).returning('*').toString();
      let result = await client.query(query);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.updateService = (client, id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = pg('parking_service').update(body).returning('*').toString();
      let result = await client.query(query);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}