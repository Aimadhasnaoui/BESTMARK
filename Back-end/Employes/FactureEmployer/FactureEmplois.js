const mongoose = require("mongoose");

const FactureEmploiSchema = new mongoose.Schema({
  employee : { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  salaire : { type: Number, required: true },
  mois : { type: Number, required: true },
  annee : { type: Number, required: true },
  avance : { type: Number, required: true },
  reste : { type: Number, required: true },
  TotalVerser : { type: Number, required: true },
  
  
})
module.exports = mongoose.model("FactureEmploi", FactureEmploiSchema);