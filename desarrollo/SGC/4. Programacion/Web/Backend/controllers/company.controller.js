var db = require('../config/db');
const uuidv4 = require('uuid/v4');
const dsCompany = require('../datasource/company.datasource');
const dsUser = require('../datasource/user.datasource');
const dsEmployee = require('../datasource/employee.datasource');

const userParkingType = 2;
const userCompanyType = 1;

// exports.login = async (req, res) => {
//   try {
//     let result = await 
//   } catch(error) {

//   }
// }

exports.login = async (req,res) => {
  try {
    let result = await dsUser.login(db, req.body.email, req.body.password, userCompanyType);
    return res.status(200).send(result);
  } catch(error) {
    return res.status(500).send(error);
  }
}

exports.get = async (req, res) => {
  try {
    let resp = await dsCompany.get(db);
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
    let insertUser = await dsUser.create(client, req.body, userCompanyType);
    let insertCompany = await dsCompany.create(client, req.body, insertUser.id);
    await client.query('COMMIT');
    delete insertUser.password;
    client.release();
    res.status(200).send({
      insertUser: insertUser,
      insertCompany: insertCompany
    });
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }
    res.status(500).send(err);
  }
}

exports.getEmployees = async (req, res) => {
  try {
    let result = await dsEmployee.getByCompany(db, req.params.id_company);
    res.status(200).send(result);
  } catch(error) {
    console.log(error);
    res.status(500).send(error);
  }
}