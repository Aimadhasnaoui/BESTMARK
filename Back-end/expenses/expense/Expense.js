const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  expenseType: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ExpenseType",
    required: true
  },
  description: { type: String },
  date: { type: Date, default: Date.now },
  paidBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);
