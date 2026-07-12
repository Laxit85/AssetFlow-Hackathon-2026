import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationCode: {
      type: String,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "INFO",
        "SUCCESS",
        "WARNING",
        "ERROR",
      ],
      default: "INFO",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre("save", async function () {

    if (!this.isNew || this.notificationCode) return;

    const last = await mongoose.model("Notification")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.notificationCode) {
        number = parseInt(last.notificationCode.replace("NTF", "")) + 1;
    }

    this.notificationCode = `NTF${String(number).padStart(6, "0")}`;

});

export default mongoose.model(
    "Notification",
    notificationSchema
);