const express = require('express');
const router = express.Router();
const {
	getLatestTicketMessages,
	createTicketMessage,
} = require('../controllers/TicketMessage');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/latest/:amount', authorizeRole('ADMIN'), getLatestTicketMessages);
router.post('/', createTicketMessage);

module.exports = router;
