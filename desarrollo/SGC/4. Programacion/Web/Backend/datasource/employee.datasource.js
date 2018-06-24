const uuidv4 = require('uuid/v4');

exports.create = (client, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'insert into employee (id, first_name, last_name, status, dni, phone_number, position, salary, id_company, id_parking) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *';
      const values = [uuidv4(), body.first_name, body.last_name, body.status, body.dni, body.phone_number, body.position, body.salary, body.id_company, body.id_parking];
      let resp = await client.query(query, values);
      resolve(resp.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}

exports.getByCompany = (client, id_company) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'select e.id, e.first_name, e.last_name, e.status, e.dni, e.phone_number, e.position, e.salary, e.id_company, e.id_parking from employee e join company c on e.id_company = c.id where c.id = $1';
      values = [id_company];
      let resp = await client.query(query, values);
      resolve(resp.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}

exports.getNotAssigned = (client) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'select * from employee where id_parking = null';
      let response = await client.query(query);
      resolve(response.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}