import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    purpose: {
      type: String,
      default: "",
    },

    startDateTime: {
      type: Date,
      required: true,
    },

    endDateTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "UPCOMING",
        "ONGOING",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "UPCOMING",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre("save", async function () {

    if (!this.isNew || this.bookingCode) return;

    const last = await mongoose.model("Booking")
        .findOne()
        .sort({ createdAt: -1 });

    let number = 1;

    if (last?.bookingCode) {
        number = parseInt(last.bookingCode.replace("BK", "")) + 1;
    }

    this.bookingCode = `BK${String(number).padStart(6, "0")}`;

});

export default mongoose.model("Booking", bookingSchema);