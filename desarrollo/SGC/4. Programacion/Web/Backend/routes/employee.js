var express = require('express');
var router = express.Router();
var Employee = require('../controllers/employee.controller');

const employeeSchemas = require('../controllers/schemas/employee.schema');
const validator = require('../controllers/schemas/validate');

/* GET home page. */
router.post('/', validator.middlewareRequestValidation.bind(null, employeeSchemas.createSchema), Employee.create);
router.get('/notAssigned', Employee.getNotAssigned);
router.get('/byCompany', Employee.getEmployeesByCompany);
router.get('/search', Employee.getEmployeesByCompanyByName);
router.get('/countByCompany', Employee.getCountEmployeesByCompany);
router.get('/countByCompanyByName', Employee.getCountEmployeesByCompanyByName);
router.patch('/:id', validator.middlewareRequestValidation.bind(null, employeeSchemas.updateSchema), Employee.update);

module.exports = router;
