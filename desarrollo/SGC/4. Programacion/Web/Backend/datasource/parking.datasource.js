const pg = require('knex')({ client: 'pg' });

const db = require('../config/db');
const uuidv4 = require('uuid/v4');

const MAX_RADIUS_KILOMETERS = '5';

const queryParkingById = `select p.*, row_to_json(e.*) as employee from parking p left join employee e on e.id = p.id_employee where p.id = $1`
const querySelectInRadius = `SELECT p.*, json(ST_AsGeoJSON(l.location)) as location, 
(
  select json_agg(json_build_object(
      'id', ps.id,
        'id_service', ps.id_service,
        'cost_hour', ps.cost_hour,
        'name', s.name,
        'status', ps.status
    )) from parking_service ps join service s on s.id = ps.id_service
    where ps.id_parking = p.id
) as services
FROM location l join parking p on l.id = p.id_location WHERE ST_DistanceSphere(CAST(l.location AS geometry), ST_MakePoint($1,$2)) <= ${MAX_RADIUS_KILOMETERS} * 1000.0;`;
const querySelectParkings = `select
p.*,
m.email,
json(ST_AsGeoJSON(l.location)) as location,
to_json(e.*) as employee,
(
  select json_agg(json_build_object(
      'id', ps.id,
        'id_service', ps.id_service,
        'cost_hour', ps.cost_hour,
        'name', s.name,
        'status', ps.status
    )) from parking_service ps join service s on s.id = ps.id_service
    where ps.id_parking = p.id
) as services,
(
  select json_agg(json_build_object(
      'id', emp.id,
        'first_name', emp.first_name,
        'last_name', emp.last_name,
        'status', emp.status
    )) from employee emp join parking park on park.id = emp.id_parking
    where park.id = p.id
) as employees
     from parking p join location l on l.id = p.id_location
     left join employee e on e.id = p.id_employee
     join mainuser m on m.id = p.id_user
     where p.id_company = $1
     order by p.name limit $2 offset $3`;

const querySelectParkingsByName = `select
     p.*,
     m.email,
     json(ST_AsGeoJSON(l.location)) as location,
     to_json(e.*) as employee,
     (
       select json_agg(json_build_object(
           'id', ps.id,
             'id_service', ps.id_service,
             'cost_hour', ps.cost_hour,
             'name', s.name,
             'status', ps.status
         )) from parking_service ps join service s on s.id = ps.id_service
         where ps.id_parking = p.id
     ) as services,
     (
       select json_agg(json_build_object(
           'id', emp.id,
             'first_name', emp.first_name,
             'last_name', emp.last_name,
             'status', emp.status
         )) from employee emp join parking park on park.id = emp.id_parking
         where park.id = p.id
     ) as employees
          from parking p join location l on l.id = p.id_location
          left join employee e on e.id = p.id_employee
          join mainuser m on m.id = p.id_user
          where p.id_company = $1 and UPPER(p.name) like UPPER($2)
          order by p.name limit $3 offset $4`;


const querySelectCountParkings = `select COUNT(id) from parking where id_company = $1`;
const querySelectCountParkingsByName = `select COUNT(id) from parking where id_company = $1 and name like $2`;


const dsLocation = require('./location.datasource');

exports.getNearbyParkings = (lat, lng) => {
  return new Promise(async (resolve, reject) => {
    try {
      let values = [lat, lng];
      let resp = await db.query(querySelectInRadius, values);
      resolve(resp.rows);
    } catch (error) {
      reject(error);
    }
  });
}

exports.create = (client, body, id_user, id_location) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insertValues = {
        ...body,
        id: uuidv4(),
        id_user: id_user,
        id_location: id_location
      }
      delete insertValues.coordinates;
      delete insertValues.email;
      delete insertValues.password;
      delete insertValues.cost_hour;
      const query = pg('parking').insert(insertValues).returning('*').toString();
      console.log(query);
      const valuesParking = [uuidv4(), body.name, body.address, body.phone_number, body.status, body.capacity, id_user, body.id_company, id_location, body.id_employee];
      // let insertParking = await client.query(queryParking, valuesParking);
      let insertParking = await client.query(query);
      resolve(insertParking.rows[0]);
    } catch (err) {
      reject(err);
    }
  })
}

exports.getParkingsEmployeesServicesByCompany = (client, id_company, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company, limit, page];
      let result = await client.query(querySelectParkings, values);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getParkingsCountByCompany = (client, id_company) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company];
      let result = await client.query(querySelectCountParkings, values);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.updateParking = (client, id, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = pg('parking').where('id', id).update(values).returning('*').toString();
      console.log('QUERY:', query);
      let result = await client.query(query);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getParkingsEmployeesServicesByCompanyByName = (client, id_company, limit, page, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company, name + '%', limit, page];
      let result = await client.query(querySelectParkingsByName, values);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getParkingSearchByNameCount = (client, id_company, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const values = [id_company, name + '%'];
      let result = await client.query(querySelectCountParkingsByName, values);
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getAllParkingsByCompany = (client, id_company) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = pg('parking').select('id', 'name').where('id_company', id_company).toString();
      let result = await client.query(query);
      resolve(result.rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

exports.getParkingById = (client, id_parking) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await client.query(queryParkingById, [id_parking])
      resolve(result.rows[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}