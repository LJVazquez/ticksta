const express = require('express');
const router = express.Router();
const {
	getTickets,
	getTicketById,
	createTicket,
	updateTicket,
	getLatestTickets,
} = require('../controllers/Ticket');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', getTickets);
router.post('/', authorizeRole('USER'), createTicket);

router.get('/:id', getTicketById);
router.patch('/:id', authorizeRole(['ADMIN', 'DEV', 'MANAGER']), updateTicket);

router.get(
	'/latest/:amount',
	authorizeRole(['MANAGER', 'ADMIN']),
	getLatestTickets
);

module.exports = router;
