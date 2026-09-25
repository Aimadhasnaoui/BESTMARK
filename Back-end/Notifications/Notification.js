const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    emploisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    message: { type: String, required: true, trim: true },
    path: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["alert", "info", "success", "warning"],
      default: "info",
    },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", NotificationSchema);
