const Message = require('../models/Message');

// @desc    Get chat messages for a channel
// @route   GET /api/chat
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { channel } = req.query;

    if (!channel || !['general', 'projects', 'tasks'].includes(channel)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing chat channel' });
    }

    if (!req.user || !req.user.company) {
      return res.status(401).json({ success: false, message: 'User company context not found' });
    }

    // Fetch the last 100 messages for this company and channel, sorted chronologically
    const messages = await Message.find({
      company: req.user.company,
      channel,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('sender', 'name role designation');

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
};

// @desc    Post a new chat message
// @route   POST /api/chat
// @access  Private
const postMessage = async (req, res) => {
  try {
    const { channel, content } = req.body;

    if (!channel || !['general', 'projects', 'tasks'].includes(channel)) {
      return res.status(400).json({ success: false, message: 'Invalid chat channel' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    if (!req.user || !req.user.company) {
      return res.status(401).json({ success: false, message: 'User company context not found' });
    }

    const message = await Message.create({
      sender: req.user.id,
      company: req.user.company,
      channel,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name role designation');

    // Emit live update to sockets if io is bound
    const io = req.app.get('io');
    if (io) {
      // Emit to company-wide room
      io.to(req.user.company.toString()).emit('receive_chat_message', populatedMessage);
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error('Post message error:', error);
    res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

module.exports = {
  getMessages,
  postMessage,
};
