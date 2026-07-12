import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "ADMIN",
        "ASSET_MANAGER",
        "DEPARTMENT_HEAD",
        "EMPLOYEE",
      ],
      default: "EMPLOYEE",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      default: "",
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

userSchema.pre("save", async function () {

    if (!this.isNew || this.employeeCode) return;

    const lastUser = await mongoose
        .model("User")
        .findOne()
        .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastUser?.employeeCode) {
        nextNumber =
            parseInt(lastUser.employeeCode.replace("EMP", "")) + 1;
    }

    this.employeeCode = `EMP${String(nextNumber).padStart(3, "0")}`;

});

export default mongoose.model("User", userSchema);