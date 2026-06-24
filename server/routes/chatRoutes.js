const express = require('express');
const router = express.Router();
const { getMessages, postMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMessages);
router.post('/', postMessage);

module.exports = router;
