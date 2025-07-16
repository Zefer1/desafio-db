const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
  nome:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  telefone: String,
  morada:   String
});

module.exports = model('Cliente', ClienteSchema);
