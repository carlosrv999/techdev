const uuidv4 = require('uuid/v4');

exports.get = (client) => {
  return new Promise(async (resolve, reject) => {
    try {
      let resp = await client.query('select * from company');
      resolve(resp.rows);
    } catch (error) {
      reject(error);
    }
  })
}

exports.create = (client, body, id_user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'insert into company(id, name, phone_number, address, id_user) values ($1, $2, $3, $4, $5) returning *';
      const values = [uuidv4(), body.name, body.phone_number, body.address, id_user];
      let resp = await client.query(query, values);
      resolve(resp.rows[0]);
    } catch(err) {
      console.log(err);
      reject(err);
    }
  });
}