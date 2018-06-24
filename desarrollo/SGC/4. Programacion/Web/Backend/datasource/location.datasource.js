const uuidv4 = require('uuid/v4');
const pg = require('knex')({ client: 'pg' });

exports.create = (client, coordinates) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryLocation = 'insert into location(location) values (ST_GeogFromText($1)) returning *';
      const valuesLocation = [coordinates]
      let insertLocation = await client.query(queryLocation, valuesLocation);
      resolve(insertLocation.rows[0]);
    } catch(error) {
      reject(error);
    }
  });
}

exports.updateById = (client, id, coordinates) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'update location set location = ST_GeogFromText($1) where id = $2 returning *';
      console.log(query);
      const values = [coordinates, id];
      let result = await client.query(query, values);
      console.log('exito');
      resolve({
        msg: "success",
        result: result.rows[0]
      });
    } catch(error) {
      console.log(error);
      reject(error);
    }
  });
}