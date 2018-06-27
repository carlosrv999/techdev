exports.updateSchema = {
  "type": "object",
  "properties": {
    "first_name": {
      "type": "string"
    },
    "last_name": {
      "type": "string"
    },
    "status": {
      "type": "boolean"
    },
    "dni": {
      "type": "string"
    },
    "phone_number": {
      "type": "string"
    },
    "position": {
      "type": "string"
    },
    "salary": {
      "type": "number"
    },
    "id_parking": {
      "type": ["string", "null"]
    }
  },
  "anyOf": [
    { "required": ["first_name"] },
    { "required": ["last_name"] },
    { "required": ["status"] },
    { "required": ["dni"] },
    { "required": ["phone_number"] },
    { "required": ["position"] },
    { "required": ["salary"] },
    { "required": ["id_parking"] }
  ],
  "additionalProperties": false
}

exports.createSchema = {
  "type": "object",
  "properties": {
    "first_name": {
      "type": "string"
    },
    "last_name": {
      "type": "string"
    },
    "dni": {
      "type": "string"
    },
    "phone_number": {
      "type": "string"
    },
    "position": {
      "type": "string"
    },
    "salary": {
      "type": "number"
    },
    "id_parking": {
      "type": ["string", "null"]
    },
    "id_company": {
      "type": "string"
    }
  },
  "required": ["first_name", "last_name", "dni", "phone_number", "position", "salary"],
  "additionalProperties": false
}