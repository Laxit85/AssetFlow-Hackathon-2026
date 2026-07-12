const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    // the shared/bookable Asset (room, vehicle, equipment) being reserved
    resource: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },

    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookedForDepartment: { type: Schema.Types.ObjectId, ref: 'Department', default: null },

    purpose: { type: String, trim: true, default: '' },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
      index: true,
    },

    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    cancelReason: { type: String, trim: true, default: null },

    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// speeds up overlap queries: find bookings for a resource intersecting a range
bookingSchema.index({ resource: 1, startTime: 1, endTime: 1 });

bookingSchema.pre('validate', function preValidate(next) {
  if (this.startTime && this.endTime && this.startTime >= this.endTime) {
    return next(new Error('startTime must be before endTime'));
  }
  return next();
});

module.exports = mongoose.model('Booking', bookingSchema);
