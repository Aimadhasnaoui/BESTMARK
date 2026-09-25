const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true }, // INV-20240427-001
    servedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        itemTotal: { type: Number }, // ← quantity × sellingPrice (not computed yet, see REPORT_GAPS 2d)
      },
    ],

    subtotal: { type: Number },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number },
    deliveryfees: { type: Number },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true,
    },
    remainAmountpaymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: false,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "partial", "refunded", "unpaid"],
      default: "paid",
    },

    paidAmount: { type: Number, required: true }, // how much customer gave you
    remainAmount: { type: Number, default: 0 }, // totalAmount - paidAmount ← the credit
    customerName: { type: String, default: null },
    customerPhone: { type: String, default: null },
    requiresDelivery: { type: Boolean, default: false },
    payementInlivrisan: { type: Boolean, default: false },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: function () {
        return this.requiresDelivery == true;
      },
    },
    saleDate: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

// Sales filtered by period, and the daily invoice counter in CreateSale
SaleSchema.index({ saleDate: -1 });
SaleSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Sale", SaleSchema);
