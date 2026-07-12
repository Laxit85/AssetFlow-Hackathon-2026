import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    module: {
      type: String,
      enum: [
        "AUTH",
        "USER",
        "DEPARTMENT",
        "CATEGORY",
        "ASSET",
        "ALLOCATION",
        "TRANSFER",
        "BOOKING",
        "MAINTENANCE",
        "AUDIT",
      ],
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    description: {
      type: String,
      required: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
    "ActivityLog",
    activityLogSchema
);