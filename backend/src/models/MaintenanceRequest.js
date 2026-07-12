import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    maintenanceCode: {
      type: String,
      unique: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    technician: {
      type: String,
      trim: true,
      default: "",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },

    resolution: {
      type: String,
      default: "",
    },

    estimatedCost: {
      type: Number,
      default: 0,
    },

    actualCost: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
      ],
      default: "PENDING",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

maintenanceRequestSchema.pre("save", async function () {

    if (!this.isNew || this.maintenanceCode) return;

    const last = await mongoose.model("MaintenanceRequest")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.maintenanceCode) {
        number = parseInt(last.maintenanceCode.replace("MNT", "")) + 1;
    }

    this.maintenanceCode = `MNT${String(number).padStart(6, "0")}`;

});

export default mongoose.model(
    "MaintenanceRequest",
    maintenanceRequestSchema
);