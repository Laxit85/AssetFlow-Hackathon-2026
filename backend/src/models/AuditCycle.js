import mongoose from "mongoose";

const auditCycleSchema = new mongoose.Schema(
  {
    auditCode: {
      type: String,
      unique: true,
    },

    cycleName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PLANNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PLANNED",
    },
  },
  {
    timestamps: true,
  }
);

auditCycleSchema.pre("save", async function () {

    if (!this.isNew || this.auditCode) return;

    const last = await mongoose.model("AuditCycle")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.auditCode) {
        number = parseInt(last.auditCode.replace("AUD", "")) + 1;
    }

    this.auditCode = `AUD${String(number).padStart(6, "0")}`;

});

export default mongoose.model("AuditCycle", auditCycleSchema);