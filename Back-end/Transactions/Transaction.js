const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sale', 'expense', 'purchase','return'],
    required:true
  },
  direction: {
    type: String,
    enum: ['in', 'out'],
    required:true   // 'in' = revenue, 'out' = cost
  },
  amount: {type:Number,required:true,trim:true,default:0},
  referenceId: {type:mongoose.Schema.Types.ObjectId},
  referenceModel: {
    type: String,
    enum: ['Sale', 'Expense', 'Purchase','adjustment','return','FactureEmploi']
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  date: {type:Date,required:true,default:Date.now},
  note: {type:String,required:true}
  
},{timestamps:true});

// Finance views sorted by date, and lookups of the transaction behind a sale/purchase/payslip
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ referenceId: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
