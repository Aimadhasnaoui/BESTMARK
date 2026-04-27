const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],

  status: {
    type: String,
    enum: ['pending', 'preparing', 'on_route', 'arrived', 'failed'],
    default: 'pending'
  },
  deliveryMan: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  deliveryAddress: {
    street: String,
    city: String,
    phone: String,
    notes: String
  },
  estimatedArrival: {type:Date,required:true},
  actualArrival: {type:Date,required:true},
  createdAt: {type:Date,default:Date.now},
  updatedAt: {type:Date,default:Date.now}
    
})



module.exports = mongoose.model("Delivery", DeliverySchema);
