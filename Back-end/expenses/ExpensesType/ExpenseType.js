const mongoose = require("mongoose");

const ExpenseTypeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  isPriceFixed: { 
    type: Boolean, 
    default: false 
  },
  amount: { 
    type: Number,
    // amount is required only if isPriceFixed is true
    required: function() { 
      return this.isPriceFixed; 
    } 
  }
}, { timestamps: true });

module.exports = mongoose.model("ExpenseType", ExpenseTypeSchema);
