exports.changePasswordSchema = {
  "type": "object",
  "properties": {
    "oldPassword": { "type": "string" },
    "newPassword": { "type": "string" }
  },
  "required": ["oldPassword", "newPassword"],
  "additionalProperties": false
}