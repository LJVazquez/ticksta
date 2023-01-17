const express = require('express');
const router = express.Router();
const {
	getTickets,
	getTicketById,
	createTicket,
	updateTicket,
	getTicketsByUserId,
	createTicketMessage,
} = require('../controllers/Ticket');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authorizeRole('ADMIN'), getTickets);
router.get('/:id', getTicketById);
router.get('/user/:id', getTicketsByUserId);
router.post('/', createTicket, authorizeRole('USER'));
router.post('/:id/messages', createTicketMessage);
router.patch('/:id', authorizeRole('USER'), updateTicket);

module.exports = router;
