PGUSER=postgres \
PGHOST=172.17.0.2 \
PGPASSWORD=carlos \
PGDATABASE=cocheras \
PGPORT=5432 \
npm start

PGUSER=postgres \
PGHOST=localhost \
PGPASSWORD=carlos \
PGDATABASE=cocheras \
PGPORT=5432 \
npm start

PGUSER=postgres PGHOST=localhost PGPASSWORD=carlos PGDATABASE=cocheras PGPORT=5432 npm start

--gap:
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION postgis_sfcgal;
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION postgis_tiger_geocoder;

--en mi pc:
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_sfcgal;
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION address_standardizer_data_us;
CREATE EXTENSION postgis_tiger_geocoder;
CREATE EXTENSION postgis_topology;

--INICIO SCRIPT

CREATE TABLE mainuser(
    id varchar(36),
    email varchar(50) NOT NULL,
    password varchar(60) NOT NULL,
    usertype smallint NOT NULL
);
CREATE TABLE employee(
	id varchar(36) NOT NULL,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    status boolean NOT NULL DEFAULT TRUE,
    dni varchar(8) NOT NULL CHECK(LENGTH(dni) = 8),
    phone_number varchar(20),
    position varchar(50),
    salary numeric(12, 2),
    id_company varchar(36) NOT NULL,
    id_parking varchar(36)
);
CREATE TABLE company(
    id varchar(36) NOT NULL,
    name varchar(50) NOT NULL,
    phone_number varchar(20),
    address varchar(60),
    id_user varchar(36) NOT NULL
);
CREATE TABLE parking(
    id varchar(36) NOT NULL,
    name varchar(50),
    address varchar(60),
    phone_number varchar(20),
    status boolean NOT NULL DEFAULT TRUE,
    capacity int NOT NULL,
    current_used int DEFAULT 0 CHECK(current_used <= capacity),
    id_user varchar(36) NOT NULL,
    id_company varchar(36) NOT NULL,
    id_employee varchar(36),
    id_location integer NOT NULL
);
CREATE TABLE location(
	id SERIAL NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL
);
CREATE TABLE service(
	id SERIAL NOT NULL,
    name varchar(30) NOT NULL
);
CREATE TABLE parking_service(
    id varchar(36) NOT NULL,
    id_parking varchar(36) NOT NULL,
    id_service integer NOT NULL,
    cost_hour numeric(12, 2) NOT NULL,
    status boolean NOT NULL DEFAULT TRUE
);
CREATE TABLE client(
	id SERIAL NOT NULL,
    license_plate varchar(10) NOT NULL
);
CREATE TABLE transaction_service(
	id varchar(36) NOT NULL,
    id_client integer,
    id_parking varchar(36) NOT NULL,
    id_employee varchar(36),
    transaction_start_date timestamp DEFAULT current_timestamp,
    ongoing boolean DEFAULT TRUE
);
CREATE TABLE transaction_service_detail(
	id varchar(36) NOT NULL,
    id_transaction varchar(36) NOT NULL,
    id_parkservice varchar(36) NOT NULL,
    cost numeric(12, 2) NOT NULL,
    hours integer NOT NULL
);


ALTER TABLE mainuser ADD CONSTRAINT pk_user PRIMARY KEY(id);
ALTER TABLE company ADD CONSTRAINT pk_company PRIMARY KEY(id);
ALTER TABLE parking ADD CONSTRAINT pk_parking PRIMARY KEY(id);
ALTER TABLE location ADD CONSTRAINT pk_location PRIMARY KEY (id);
ALTER TABLE employee ADD CONSTRAINT pk_employee PRIMARY KEY(id);
ALTER TABLE service ADD CONSTRAINT pk_service PRIMARY KEY(id);
ALTER TABLE parking_service ADD CONSTRAINT pk_parking_service PRIMARY KEY(id);
ALTER TABLE client ADD CONSTRAINT pk_client PRIMARY KEY(id);
ALTER TABLE transaction_service ADD CONSTRAINT pk_transaction PRIMARY KEY(id);
ALTER TABLE transaction_service_detail ADD CONSTRAINT pk_transervice PRIMARY KEY(id);

ALTER TABLE mainuser ADD CONSTRAINT email_usertype_unique UNIQUE (email, usertype);
ALTER TABLE parking_service ADD CONSTRAINT parking_service_unique UNIQUE (id_parking, id_service);

ALTER TABLE company ADD CONSTRAINT company_user_fk FOREIGN KEY (id_user) REFERENCES mainuser (id);

ALTER TABLE parking ADD CONSTRAINT parking_user_fk FOREIGN KEY (id_user) REFERENCES mainuser (id);
ALTER TABLE parking ADD CONSTRAINT parking_company_fk FOREIGN KEY (id_company) REFERENCES company (id);
ALTER TABLE parking ADD CONSTRAINT parking_employee_fk FOREIGN KEY (id_employee) REFERENCES employee (id);
ALTER TABLE parking ADD constraint fk_parking_location FOREIGN KEY(id_location) REFERENCES location(id);

ALTER TABLE employee ADD CONSTRAINT employee_company_fk FOREIGN KEY (id_company) REFERENCES company (id);
ALTER TABLE employee ADD CONSTRAINT employee_parking_fk FOREIGN KEY (id_parking) REFERENCES parking (id);

ALTER TABLE parking_service ADD CONSTRAINT parkservice_parking_fk FOREIGN KEY (id_parking) REFERENCES parking (id);
ALTER TABLE parking_service ADD CONSTRAINT parkservice_service_fk FOREIGN KEY (id_service) REFERENCES service (id);

ALTER TABLE transaction_service ADD CONSTRAINT transaction_client_fk FOREIGN KEY (id_client) REFERENCES client (id);
ALTER TABLE transaction_service ADD CONSTRAINT transaction_parking_fk FOREIGN KEY (id_parking) REFERENCES parking (id);
ALTER TABLE transaction_service ADD CONSTRAINT transaction_employee_fk FOREIGN KEY (id_employee) REFERENCES employee (id);

ALTER TABLE transaction_service_detail ADD CONSTRAINT transervice_transaction_fk FOREIGN KEY (id_transaction) REFERENCES transaction_service (id);
ALTER TABLE transaction_service_detail ADD CONSTRAINT transervice_service_fk FOREIGN KEY (id_parkservice) REFERENCES parking_service (id);

insert into service (name) values ('Alquiler de Cupo');
insert into service (name) values ('Lavado de Autos');
insert into service (name) values ('Encerado de Autos');

CREATE or replace FUNCTION emp_not_in_parking() RETURNS trigger AS $emp_not_in_parking$
    DECLARE
        emp employee%ROWTYPE;
    BEGIN
        -- Check that empname and salary are given
        IF NEW.id_employee is null then
        	RETURN NEW;
        END IF;
        select * into emp from employee where id = NEW.id_employee;
        IF emp.id_parking is null then
        	RAISE EXCEPTION 'employee does not work in parking';
        END IF;
        IF (TG_OP = 'UPDATE') THEN
        	IF emp.id_parking != OLD.id THEN
            	RAISE EXCEPTION 'employee does not work in parking';
            END IF;
        ELSIF (TG_OP = 'INSERT') THEN
        	IF emp.id_parking != NEW.id THEN
            	RAISE EXCEPTION 'employee does not work in parking';
            END IF;
        END IF;
        RETURN NEW;
    END;
$emp_not_in_parking$ LANGUAGE plpgsql;

CREATE TRIGGER emp_not_in_parking BEFORE INSERT OR UPDATE ON parking
    FOR EACH ROW EXECUTE PROCEDURE emp_not_in_parking();

CREATE or replace FUNCTION park_currentused_reset() RETURNS trigger AS $park_currentused_reset$
    BEGIN
        -- Check that empname and salary are given       
        IF NEW.capacity < OLD.current_used THEN
        	NEW.current_used := NEW.capacity;
        END IF;
        RETURN NEW;
    END;
$park_currentused_reset$ LANGUAGE plpgsql;

CREATE TRIGGER park_currentused_reset BEFORE UPDATE ON parking
    FOR EACH ROW EXECUTE PROCEDURE park_currentused_reset();

--FIN SCRIPT

CREATE TABLE global_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64),
    location GEOGRAPHY(POINT)
);

drop table if exists parking cascade;
drop table if exists company cascade;
drop table if exists employee cascade;
drop table if exists location cascade;
drop table if exists mainuser cascade;
drop table if exists service cascade;
drop table if exists parking_service cascade;
drop table if exists client cascade;
drop table if exists transaction_service cascade;
drop table if exists transaction_service_detail cascade;

truncate table parking cascade;
truncate table company cascade;
truncate table employee cascade;
truncate table location cascade;
truncate table mainuser cascade;
truncate table service cascade;
truncate table parking_service cascade;
truncate table client cascade;
truncate table transaction_service cascade;
truncate table transaction_service_detail cascade;

select * from parking p 
	join company c on c.id = p.id_company
    join location l on l.id = p.id_location
    left join employee e on p.id_employee = e.id;

select * from parking;
select * from company;
select * from employee;
select * from location;
select * from mainuser;
select * from service;
select * from parking_service;
select * from client;
select * from transaction_service;
select * from transaction_service_detail;

drop table global_points;

SELECT * FROM geography_columns;
SELECT ST_AsGeoJSON(coordinates) FROM parking;

INSERT INTO global_points (name, location) VALUES ('Town', ST_GeogFromText('SRID=4326;POINT(-12.057054 -77.065071)') );
select ST_AsGeoJSON(location) from global_points;

select c.id, 
	(select json_agg(json_build_object(
        'id', p.id,
        'phone_number', p.phone_number, 
        'name', p.name,
        'location', ST_AsGeoJSON(l.location),
        'employee', to_json(e.*)
    	))
     from parking p join location l on l.id = p.id_location
     left join employee e on e.id = p.id_employee
     where p.id_company = c.id) as parkings 
from company c 
where c.id='ecfae6bf-6956-4611-9439-919070c0a610';

--query para obtener cocheras, con empleado principal y servicios, si existen
select
p.id,
p.capacity,
p.current_used,
p.id_company,
p.address,
p.phone_number, 
p.name,
ST_AsGeoJSON(l.location),
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
) as services
     from parking p join location l on l.id = p.id_location
     left join employee e on e.id = p.id_employee
     where p.id_company = 'ecfae6bf-6956-4611-9439-919070c0a610';
