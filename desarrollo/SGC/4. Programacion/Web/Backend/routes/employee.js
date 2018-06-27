var express = require('express');
var router = express.Router();
var Employee = require('../controllers/employee.controller');

/* GET home page. */
router.post('/', Employee.create);
router.get('/notAssigned', Employee.getNotAssigned);
router.get('/byCompany', Employee.getEmployeesByCompany);
router.get('/search', Employee.getEmployeesByCompanyByName);
router.get('/countByCompany', Employee.getCountEmployeesByCompany);
router.get('/countByCompanyByName', Employee.getCountEmployeesByCompanyByName);

module.exports = router;
