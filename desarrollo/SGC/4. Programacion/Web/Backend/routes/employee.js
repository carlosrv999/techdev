var express = require('express');
var router = express.Router();
var Employee = require('../controllers/employee.controller');

/* GET home page. */
router.post('/', Employee.create);
router.get('/notAssigned', Employee.getNotAssigned);

module.exports = router;
