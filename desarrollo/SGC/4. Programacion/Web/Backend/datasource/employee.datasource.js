const pg = require('knex')({ client: 'pg' });
const uuidv4 = require('uuid/v4');

exports.create = (client, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let submitValues = {
        ...body,
        id: uuidv4()
      };
      const query = pg('employee').insert(submitValues).returning('*').toString();
      let resp = await client.query(query);
      resolve(resp.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}

exports.update = (client, id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = pg('employee').update(body).where('id', id).returning('*').toString();
      let resp = await client.query(query);
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

exports.getEmployeesCountByCompany = (client, id_company) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'select COUNT(id) from employee where id_company = $1';
      const values = [id_company];
      let result = await client.query(query, values);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getEmployeesByCompany = (client, id_company, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company, limit, page];
      let result = await client.query('select * from employee where id_company = $1 order by last_name limit $2 offset $3', values);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getEmployeesByCompanyByName = (client, id_company, limit, page, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company, name + '%', limit, page];
      let result = await client.query('select * from employee where id_company = $1 and UPPER(last_name) like UPPER($2) order by last_name limit $3 offset $4', values);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getEmployeeSearchByNameCount = (client, id_company, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company, name + '%'];
      let result = await client.query('select count(id) from employee where id_company = $1 and UPPER(last_name) like UPPER($2)', values);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}