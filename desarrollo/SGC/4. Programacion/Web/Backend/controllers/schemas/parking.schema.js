exports.updateSchema = {
  "type": "object",
  "properties": {
    "address": {
      "type": "string"
    },
    "capacity": {
      "type": "integer"
    },
    "id_employee": {
      "type": ["string", "null"]
    },
    "name": {
      "type": "string"
    },
    "phone_number": {
      "type": "string"
    },
    "status": {
      "type": "boolean"
    },
    "coordinates": {
      "type": "string"
    },
    "email": {
      "type": "string"
    }
  },
  "anyOf": [
    { "required": ["address"] },
    { "required": ["capacity"] },
    { "required": ["id_employee"] },
    { "required": ["name"] },
    { "required": ["phone_number"] },
    { "required": ["status"] },
    { "required": ["coordinates"] },
    { "required": ["email"] }
    // any other properties, in a similar way
  ],
  "additionalProperties": false
}

exports.createSchema = {
  "type": "object",
  "properties": {
    "address": {
      "type": "string"
    },
    "capacity": {
      "type": "integer"
    },
    "id_employee": {
      "type": ["string", "null"]
    },
    "id_company": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "phone_number": {
      "type": "string"
    },
    "status": {
      "type": "boolean"
    },
    "coordinates": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    },
    "cost_hour": {
      "type": "number"
    }
  },
  "required": ["email", "password", "coordinates", "id_company", "name", "capacity"],
  "additionalProperties": false
}