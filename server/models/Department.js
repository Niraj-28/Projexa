const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a department name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a department code'],
      trim: true,
      uppercase: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure department code is unique per company workspace
departmentSchema.index({ company: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);
