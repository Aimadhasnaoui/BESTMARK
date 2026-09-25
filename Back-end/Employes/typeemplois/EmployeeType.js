import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
      trim: true,
    },
    actions: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const EmployeeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  permissions: {
    type: [PermissionSchema],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model("EmployeeType", EmployeeTypeSchema);
