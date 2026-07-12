import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    allocationCode: {
      type: String,
      unique: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    allocationDate: {
      type: Date,
      default: Date.now,
    },

    expectedReturnDate: Date,

    actualReturnDate: Date,

    returnCondition: {
      type: String,
      enum: ["GOOD", "DAMAGED", "LOST"],
    },

    returnNotes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "RETURNED", "OVERDUE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

allocationSchema.pre("save", async function () {

    if (!this.isNew || this.allocationCode) return;

    const last = await mongoose.model("Allocation")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.allocationCode) {
        number = parseInt(last.allocationCode.replace("ALC", "")) + 1;
    }

    this.allocationCode = `ALC${String(number).padStart(6, "0")}`;

});

export default mongoose.model("Allocation", allocationSchema);