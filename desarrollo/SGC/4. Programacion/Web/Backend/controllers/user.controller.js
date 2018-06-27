var db = require('../config/db');

const dsUser = require('../datasource/user.datasource');

exports.changePass = async (req, res) => {
  try {
    let result = await dsUser.changePass(db, req.params.id, req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
}