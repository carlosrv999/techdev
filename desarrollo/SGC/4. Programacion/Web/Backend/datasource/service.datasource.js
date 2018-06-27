const pg = require('knex')({ client: 'pg' });

const db = require('../config/db');
const uuidv4 = require('uuid/v4');

exports.getNotUsedServices = (client, id_parking) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'select * from service where id not in (select id_service from parking_service where id_parking = $1)';
      const values = [id_parking];
      let result = await client.query(query, values);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}