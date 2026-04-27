const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  barcode: { type: String},
  buyingPrice : { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  image: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  quantity: { type: Number, required: true,default: 0  },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  minStockAlert: { type: Number, default: 5 },
  Number_of_sales: { type: Number, default: 0 },
}, { timestamps: true });
ProductSchema.virtual('productprofit').get(()=>{
    return this.sellingPrice - this.buyingPrice;
})
module.exports = mongoose.model("Product", ProductSchema);
