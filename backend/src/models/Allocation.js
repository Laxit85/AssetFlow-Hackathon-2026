import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * A transfer request lives inside the Allocation it applies to.
 * Workflow: Requested -> Approved/Rejected.
 * On Approved, the allocation.service closes this allocation (status: Returned)
 * and creates a brand new Allocation document for the new holder, linking the
 * two via `supersededBy` so asset history stays intact.
 */
const transferRequestSchema = new Schema(
  {
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedToEmployee: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    requestedToDepartment: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    reason: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    requestedAt: { type: Date, default: Date.now },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    decidedAt: { type: Date, default: null },
    decisionNote: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const allocationSchema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },

    // exactly one of these two must be set (enforced in pre-validate hook below)
    allocatedToEmployee: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    allocatedToDepartment: { type: Schema.Types.ObjectId, ref: 'Department', default: null },

    allocatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    allocationDate: { type: Date, default: Date.now },
    expectedReturnDate: { type: Date, default: null },
    actualReturnDate: { type: Date, default: null },

    status: {
      type: String,
      enum: ['Active', 'Returned', 'Overdue', 'TransferPending'],
      default: 'Active',
      index: true,
    },

    returnCondition: { type: String, trim: true, default: null },
    returnNotes: { type: String, trim: true, default: null },
    approvedReturnBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    transferRequest: { type: transferRequestSchema, default: null },

    // when a transfer is approved, this allocation is closed and points to the new one
    supersededBy: { type: Schema.Types.ObjectId, ref: 'Allocation', default: null },
  },
  { timestamps: true }
);

allocationSchema.index({ asset: 1, status: 1 });

allocationSchema.pre('validate', function preValidate(next) {
  if (!this.allocatedToEmployee && !this.allocatedToDepartment) {
    return next(new Error('Allocation must target either an employee or a department'));
  }
  if (this.allocatedToEmployee && this.allocatedToDepartment) {
    return next(new Error('Allocation cannot target both an employee and a department'));
  }
  return next();
});

export default mongoose.model('Allocation', allocationSchema);
export { transferRequestSchema };
