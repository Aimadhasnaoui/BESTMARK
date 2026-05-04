const mongoose = require("mongoose");

const StockMovementSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["purchase", "sale", "return", "adjustment"], 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  }, // positive = IN, negative = OUT
  quantityBefore: { 
    type: Number, 
    required: true 
  },
  quantityAfter: { 
    type: Number, 
    required: true 
  },
  referenceModel: { 
    type: String, 
    enum: ["Sale", "Purchase"], 
    required: true 
  },
  note: { 
    type: String 
  },
}, { timestamps: true });

module.exports = mongoose.model("StockMovement", StockMovementSchema);
