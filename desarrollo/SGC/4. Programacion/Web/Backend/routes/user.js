var express = require('express');
var router = express.Router();
var User = require('../controllers/user.controller');

const userSchemas = require('../controllers/schemas/user.schema');
const validator = require('../controllers/schemas/validate');

/* GET home page. */
router.patch('/:id/changePass', validator.middlewareRequestValidation.bind(null, userSchemas.changePasswordSchema), User.changePass);

module.exports = router;