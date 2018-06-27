var tv4 = require('tv4');

exports.middlewareRequestValidation = (schema, req, res, next) => {
  var valid = tv4.validate(req.body, schema);
  if (!valid) {
    res.status(400).send(tv4.error); return;
  }
  next();
}
