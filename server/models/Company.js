const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add a company email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    industry: {
      type: String,
      trim: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ['Free', 'Professional', 'Enterprise'],
      default: 'Free',
    },
    workspaceUrl: {
      type: String,
      required: [true, 'Please add a workspace URL slug'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
    cardBrand: {
      type: String,
      default: '',
    },
    cardLast4: {
      type: String,
      default: '',
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    shiftStart: {
      type: String,
      default: '09:00 AM',
    },
    shiftGrace: {
      type: Number,
      default: 15,
    },
    weeklyOff: {
      type: String,
      default: 'sat-sun',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
