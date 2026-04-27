const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, unique: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String },
  mission: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "EmployeeType", 
    required: true 
  },
  salary: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
