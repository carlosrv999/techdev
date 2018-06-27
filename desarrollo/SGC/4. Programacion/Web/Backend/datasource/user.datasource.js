const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const pg = require('knex')({ client: 'pg' });

exports.get = (client) => {
  return new Promise(async (resolve, reject) => {
    try {
      let resp = await client.query('select * from mainuser');
      resolve(resp.rows);
    } catch (error) {
      reject(error);
    }
  });
}

exports.create = (client, body, usertype) => {
  return new Promise(async (resolve, reject) => {
    const query = 'INSERT INTO mainuser(id, email, password, usertype) values ($1, $2, $3, $4) returning *';
    try {
      let hashed = await bcrypt.hash(body.password, 10);
      const values = [uuidv4(), body.email, hashed, usertype];
      let result = await client.query(query, values);
      resolve(result.rows[0]);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

exports.login = (client, email, password, usertype) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (usertype == 1) {
        const query = 'select * from mainuser u join company c on c.id_user = u.id where u.email = $1 and u.usertype = $2';
        const values = [email, usertype];
        let result = await client.query(query, values);
        if (result.rowCount > 0) {
          if (await bcrypt.compare(password, result.rows[0].password)) {
            delete result.rows[0].password;
            resolve(result.rows[0]);
          } else {
            reject({
              "err": "incorrect password"
            });
          }
        } else {
          reject({
            "err": "invalid email"
          });
        }
      } else {
        const query = 'select * from mainuser u join parking p on p.id_user = u.id where u.email = $1 and u.usertype = $2';
        const values = [email, usertype];
        let result = await client.query(query, values);
        if (result.rowCount > 0) {
          if (await bcrypt.compare(password, result.rows[0].password)) {
            delete result.rows[0].password;
            resolve(result.rows[0]);
          } else {
            reject({
              "err": "incorrect password"
            });
          }
        } else {
          reject({
            "err": "invalid email"
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.changePass = (client, id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'select * from mainuser where id = $1';
      const values = [id];
      let result = await client.query(query, values);
      if (result.rows[0]) {
        let user = result.rows[0];
        if (await bcrypt.compare(body.oldPassword, user.password)) {
          let newPassword = await bcrypt.hash(body.newPassword, 10);
          const queryChange = 'update mainuser set password = $1 where id = $2';
          const valuesChange = [newPassword, id];
          let resultChange = await client.query(queryChange, valuesChange);
          resolve({
            msg: 'success'
          });
        } else {
          reject({
            err: 'contraseña antigua incorrecta'
          });
        }
      } else {
        reject({
          err: 'usuario no encontrado'
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.updateUserEmail = (client, id, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = 'update mainuser set email = $1 where id = $2 returning *';
      const values = [email, id];
      let result = await client.query(query, values);
      if(result.rows[0]) delete result.rows[0].password;
      if(result.rows[0]) delete result.rows[0].status;
      resolve({
        msg: 'success',
        result: result.rows[0]
      });
    } catch (error) {
      console.log(error);
      reject({
        msg: 'ocurrio un error al updatear usuario',
        err: error
      });
    }
  });
}