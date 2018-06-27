exports.updateSchema = {
  "type": "object",
  "properties": {
    "address": {
      "type": "string"
    },
    "capacity": {
      "type": "integer"
    },
    "current_used": {
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
    },
    "url_image": {
      "type": "string"
    },
    "description": {
      "type": "string"
    }
  },
  "anyOf": [
    { "required": ["address"] },
    { "required": ["capacity"] },
    { "required": ["current_used"] },
    { "required": ["id_employee"] },
    { "required": ["name"] },
    { "required": ["phone_number"] },
    { "required": ["status"] },
    { "required": ["coordinates"] },
    { "required": ["url_image"] },
    { "required": ["description"] },
    { "required": ["email"] }
    // any other properties, in a similar way
  ],
  "additionalProperties": false
}

exports.createSchema = {
  "type": "object",
  "properties": {
    "description": {
      "type": "string"
    },
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
    },
    "url_image": {
      "type": "string"
    }
  },
  "required": ["email", "password", "coordinates", "id_company", "name", "capacity", "description", "url_image"],
  "additionalProperties": false
}

exports.createService = {
  "type": "object",
  "properties": {
    "cost_hour": {
      "type": "number"
    },
    "id_service": {
      "type": "string"
    }
  },
  "required": ["cost_hour", "id_service"],
  "additionalProperties": false
}

exports.updateService = {
  "type": "object",
  "properties": {
    "cost_hour": {
      "type": "number"
    }
  },
  "required": ["cost_hour"],
  "additionalProperties": false
}