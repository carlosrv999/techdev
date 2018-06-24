var db = require('../config/db');
const uuidv4 = require('uuid/v4');
const dsEmployee = require('../datasource/employee.datasource');

console.log(uuidv4());

exports.create = async (req, res) => {
  try {
    let result = await dsEmployee.create(db, req.body);
    res.status(200).send(result);
  } catch(error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getNotAssigned = async (req, res) => {
  try {
    let result = await dsEmployee.getNotAssigned(db);
    res.status(200).send(result);
  } catch(error) {
    console.log(error);
    res.status(500).send(error);
  }
}