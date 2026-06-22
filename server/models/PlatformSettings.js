const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    backupSchedule: {
      type: String,
      default: 'daily',
    },
    rateLimit: {
      type: String,
      default: '100 req/min',
    },
    mfaRequired: {
      type: String,
      default: 'disabled',
    },
    sandboxMode: {
      type: String,
      default: 'off',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
