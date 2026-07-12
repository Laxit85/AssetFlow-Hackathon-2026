import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentCode: {
      type: String,
      unique: true,
    },

    departmentName: {
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

    parentDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    departmentHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

departmentSchema.pre("save", async function () {

    if (!this.isNew || this.departmentCode) return;

    const lastDepartment = await mongoose
        .model("Department")
        .findOne()
        .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastDepartment?.departmentCode) {
        nextNumber =
            parseInt(lastDepartment.departmentCode.replace("DEP", "")) + 1;
    }

    this.departmentCode = `DEP${String(nextNumber).padStart(3, "0")}`;

});

export default mongoose.model("Department", departmentSchema);