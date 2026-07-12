import mongoose from "mongoose";

const auditItemSchema = new mongoose.Schema(
  {
    auditCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuditCycle",
      required: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expectedLocation: {
      type: String,
      default: "",
    },

    actualLocation: {
      type: String,
      default: "",
    },

    result: {
      type: String,
      enum: [
        "VERIFIED",
        "MISSING",
        "DAMAGED",
      ],
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },

    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
    "AuditItem",
    auditItemSchema
);