const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
  password: { type: String, required: [true, "Password is required"],minlength:[8, "Password is too short"] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
EmployeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
EmployeeSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("Employee", EmployeeSchema);
