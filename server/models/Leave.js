const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    type: {
      type: String,
      enum: ['Casual Leave', 'Medical Leave', 'Unpaid Leave'],
      default: 'Casual Leave',
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date for the leave'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date for the leave'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the leave request'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Leave', leaveSchema);
