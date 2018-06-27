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

exports.update = async (req,res) => {
  try {
    let result = await dsEmployee.update(db, req.params.id, req.body);
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

exports.getCountEmployeesByCompany = async (req, res) => {
  try {
    if (!req.query.id_company) return res.status(500).send({ err: 'id_company no especificado' });
    let result = await dsEmployee.getEmployeesCountByCompany(db, req.query.id_company);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.getEmployeesByCompany = async (req, res) => {
  try {
    if (!req.query.id_company) return res.status(500).send({ err: 'id_company no especificado' });
    let limit = Number.parseInt(req.query.limit);
    let page = Number.parseInt(req.query.page);
    if (typeof limit != 'number' || typeof page != 'number') {
      return res.status(500).send({
        msg: 'el parametro limit o page no corresponden'
      });
    }
    let result = await dsEmployee.getEmployeesByCompany(db, req.query.id_company, limit, page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getEmployeesByCompanyByName = async (req, res) => {
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
    let result = await dsEmployee.getEmployeesByCompanyByName(db, req.query.id_company, limit, page, name);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getCountEmployeesByCompanyByName = async(req,res) => {
  try {
    if (!req.query.id_company || !req.query.name) return res.status(500).send({ err: 'id_company o name no especificado' });
    let result = await dsEmployee.getEmployeeSearchByNameCount(db, req.query.id_company, req.query.name);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}