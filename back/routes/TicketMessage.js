const express = require('express');
const router = express.Router();
const {
	getLatestTicketMessages,
	createTicketMessage,
} = require('../controllers/TicketMessage');
const { authorizeRole } = require('../middleware/authMiddleware');

router.post('/', createTicketMessage);

router.get('/latest/:amount', authorizeRole('ADMIN'), getLatestTicketMessages);

module.exports = router;
