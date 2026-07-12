import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// Pre-save hook: generate employeeCode if new, and hash password if modified
userSchema.pre("save", async function (next) {
  // 1. Generate employeeCode
  if (this.isNew && !this.employeeCode) {
    try {
      const lastUser = await mongoose
        .model("User")
        .findOne()
        .sort({ createdAt: -1 });

      let nextNumber = 1;
      if (lastUser?.employeeCode) {
        nextNumber = parseInt(lastUser.employeeCode.replace("EMP", "")) + 1;
      }
      this.employeeCode = `EMP${String(nextNumber).padStart(3, "0")}`;
    } catch (err) {
      return next(err);
    }
  }

  // 2. Hash password
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);