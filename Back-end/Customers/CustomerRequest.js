const mongoose = require("mongoose");

const CustomerRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  }, 
  quantity: { type: Number, default: 1,required:true },
  status: { 
    type: String, 
    enum: ["pending", "notified", "fulfilled", "cancelled"],
    default: "pending"
  },
  notes: { type: String },
  notifiedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("CustomerRequest", CustomerRequestSchema);
