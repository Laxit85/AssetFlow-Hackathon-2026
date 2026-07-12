import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetCode: {
      type: String,
      unique: true,
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    manufacturer: {
      type: String,
      trim: true,
      default: "",
    },

    model: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    purchaseDate: Date,

    purchaseCost: {
      type: Number,
      default: 0,
    },

    warrantyExpiry: Date,

    condition: {
      type: String,
      enum: ["NEW", "GOOD", "FAIR", "DAMAGED"],
      default: "NEW",
    },

    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "ALLOCATED",
        "BOOKED",
        "UNDER_MAINTENANCE",
        "LOST",
        "RETIRED",
      ],
      default: "AVAILABLE",
    },

    location: {
      type: String,
      default: "",
    },

    isBookable: {
      type: Boolean,
      default: false,
    },

    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

assetSchema.pre("save", async function () {

    if (!this.isNew || this.assetCode) return;

    const last = await mongoose.model("Asset")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.assetCode) {
        number = parseInt(last.assetCode.replace("AST", "")) + 1;
    }

    this.assetCode = `AST${String(number).padStart(6, "0")}`;

});

export default mongoose.model("Asset", assetSchema);