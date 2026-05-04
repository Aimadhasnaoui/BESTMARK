const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  code:{type:String},
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: {type:Number,required:true},
      buyingPrice: {type:Number,required:true},
      itemTotal: { type: Number } // ← quantity × buyingPrice, calculated on save
    }
  ],
  totalAmount: {type:Number,default:0,required:true},
  paidAmount: {type:Number,default:0,required:true},
  debts: {type:Number,default:0,required:true},
  paymentStatus: { type: String, enum: ['paid', 'partial', 'unpaid'],required:true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'transfer'],required:true },
  purchaseDate: { type: Date, default: Date.now,required:true },
  notes: {type:String},
}, { timestamps: true });

module.exports = mongoose.model("Purchase", PurchaseSchema);