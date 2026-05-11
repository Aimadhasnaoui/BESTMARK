const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require('validator');
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, unique: true, validate: [validator.isEmail, "Please enter a valid email"] },
  phone: { type: String, required: true, trim: true, validate: [validator.isMobilePhone, "Please enter a valid phone number"] },
  address: { type: String },
  mission: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "EmployeeType", 
    required: true 
  },
  image:{type:String},
  salary: { type: Number, required: true },
  password: { type: String, required: [true, "Password is required"],minlength:[8, "Password is too short"] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
EmployeeSchema.pre("save", async function () {
  //only if the password change
  if (!this.isModified("password")) return ;
  // encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
EmployeeSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("Employee", EmployeeSchema);
