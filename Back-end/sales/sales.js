const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },  // INV-20240427-001
  servedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
      itemTotal: { type: Number } // ← quantity × buyingPrice, calculated on save
    }
  ],

  subtotal:     { type: Number },     
  discount:     { type: Number, default: 0 }, 
  totalAmount:  { type: Number },      

  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'transfer'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'partial', 'refunded'],
    default: 'paid'
  },

  paidAmount:   { type: Number, required: true }, // how much customer gave you
  remainAmount: { type: Number, default: 0 },     // totalAmount - paidAmount ← the credit
  customerName:  { type: String },
  customerPhone: { type: String },
  requiresDelivery: { type: Boolean, default: false },
  deliveryId : {type : mongoose.Schema.Types.ObjectId,ref:'Delivery',required:function(){
    return this.requiresDelivery == true
  }},
  saleDate:  { type: Date, default: Date.now },
  notes:     { type: String },
},{timestamps:true})

module.exports = mongoose.model("Sale", SaleSchema);