const express = require('express');
const router = express.Router();
const {
	getTickets,
	getTicketById,
	createTicket,
	updateTicket,
	getLatestTickets,
	getTicketStats,
} = require('../controllers/Ticket');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', getTickets);
router.get('/stats', authorizeRole('ADMIN'), getTicketStats);
router.get('/:id', getTicketById);
router.get(
	'/latest/:amount',
	authorizeRole(['MANAGER', 'ADMIN']),
	getLatestTickets
);
router.post('/', authorizeRole('USER'), createTicket);
router.patch('/:id', authorizeRole(['ADMIN', 'DEV']), updateTicket);

module.exports = router;
