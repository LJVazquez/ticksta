const express = require('express');
const router = express.Router();
const {
	getTickets,
	getTicketById,
	createTicket,
	updateTicket,
	getTicketsByUserId,
	createTicketMessage,
	getLatestTickets,
} = require('../controllers/Ticket');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authorizeRole('ADMIN'), getTickets);
router.get('/:id', getTicketById);
router.get('/user/:id', getTicketsByUserId);
router.get('/latest/:amount', authorizeRole('ADMIN'), getLatestTickets);
router.post('/', authorizeRole('USER'), createTicket);
router.patch('/:id', authorizeRole('ADMIN'), updateTicket);

module.exports = router;