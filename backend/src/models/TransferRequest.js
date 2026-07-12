import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    transferCode: {
      type: String,
      unique: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    fromEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    reason: {
      type: String,
      default: "",
    },

    approvalRemarks: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

transferSchema.pre("save", async function () {

    if (!this.isNew || this.transferCode) return;

    const last = await mongoose.model("TransferRequest")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.transferCode) {
        number = parseInt(last.transferCode.replace("TRF", "")) + 1;
    }

    this.transferCode = `TRF${String(number).padStart(6, "0")}`;

});

export default mongoose.model("TransferRequest", transferSchema);