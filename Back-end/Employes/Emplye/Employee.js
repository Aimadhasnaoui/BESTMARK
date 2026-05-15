const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone: { type: String, required: true, trim: true },
    address: { type: String },
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeType",
      required: true,
    },
    image: { type: String },
    salary: { type: Number, required: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password is too short"],
      select: false,
    },
    isActive: { type: Boolean, default: true },
    passwordchangeafter: { type: Date, defaul: new Date() },
    AccountDesactivateDate: { type: Date, default: null },
  },
  { timestamps: true },
);
EmployeeSchema.pre("save", async function () {
  //only if the password change
  if (!this.isModified("password")) return;
  // encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
EmployeeSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
EmployeeSchema.methods.isPaswordchnageAfterToekn = async function (tokentime) {
  const timestampInSeconds = Math.floor(this.passwordchangeafter / 1000);
  if (this.passwordchangeafter) {
    return timestampInSeconds > tokentime;
  }
  return false;
};
module.exports = mongoose.model("Employee", EmployeeSchema);
