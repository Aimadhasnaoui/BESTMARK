const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sale', 'expense', 'purchase'],
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
    enum: ['Sale', 'Expense', 'Purchase']
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {type:Date,required:true,default:Date.now},
  note: {type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model("Transaction", TransactionSchema);
