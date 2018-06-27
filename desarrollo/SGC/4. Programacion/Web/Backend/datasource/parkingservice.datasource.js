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