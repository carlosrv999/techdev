var express = require('express');
var router = express.Router();
var Company = require('../controllers/company.controller');

/* GET home page. */
router.get('/', Company.get);
router.get('/:id_company/employees', Company.getEmployees);
router.post('/', Company.create);
router.post('/login', Company.login);

module.exports = router;
