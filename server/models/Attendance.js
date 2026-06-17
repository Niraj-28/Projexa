const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
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
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    checkIn: {
      type: String, // format HH:MM AM/PM
      required: true,
    },
    checkOut: {
      type: String, // format HH:MM AM/PM
      default: '',
    },
    status: {
      type: String,
      enum: ['On Time', 'Late', 'Active'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure there is only one attendance log per employee per calendar date
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
