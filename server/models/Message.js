const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Message must belong to a company/workspace'],
    },
    channel: {
      type: String,
      required: [true, 'Message must belong to a channel'],
      enum: ['general', 'projects', 'tasks'],
    },
    content: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
