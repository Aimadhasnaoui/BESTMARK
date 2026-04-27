const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true,minlength:[3, "Name is too short"] },
    password: { type: String, required: [true, "Password is required"],minlength:[8, "Password is too short"] },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "employee", "stock_manager"],
    },
    phone: { type: Number, required: true, trim: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// // Password hashing
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
