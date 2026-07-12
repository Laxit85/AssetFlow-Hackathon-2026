import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryCode: {
      type: String,
      unique: true,
    },

    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    warrantyMonths: {
      type: Number,
      default: 12,
      min: 0,
    },

    depreciationYears: {
      type: Number,
      default: 5,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", async function () {

    if (!this.isNew || this.categoryCode) return;

    const lastCategory = await mongoose
        .model("Category")
        .findOne()
        .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastCategory?.categoryCode) {
        nextNumber =
            parseInt(lastCategory.categoryCode.replace("CAT", "")) + 1;
    }

    this.categoryCode = `CAT${String(nextNumber).padStart(3, "0")}`;

});

export default mongoose.model("Category", categorySchema);