const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  productTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
}, { timestamps: true });

module.exports = mongoose.model("Supplier", SupplierSchema);
