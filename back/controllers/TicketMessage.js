const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
	validateTicketMessageCreationData,
} = require('../utils/schemaValidators.js');

//* helper de createTicketMessage
const userHasCommentPermission = (user, ticket) => {
	const userHasAllowedRole =
		user.userRole === 'ADMIN' || user.userRole === 'MANAGER';

	const userCreatedTicket = ticket.authorId === user.userId;

	const userIsAssignedToTicket = ticket.assignedToId === user.userId;

	return userHasAllowedRole || userCreatedTicket || userIsAssignedToTicket;
};

const createTicketMessage = async (req, res) => {
	const data = req.body;

	if (data.ticketId) {
		data.ticketId = parseInt(data.ticketId);
	}

	const authUserData = req.authData;

	const validationErrors = validateTicketMessageCreationData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const ticket = await prisma.ticket.findUnique({
			where: { id: data.ticketId },
		});

		if (ticket.status === 'CLOSED') {
			return res.status(409).json({ error: 'Ticket closed' });
		}

		if (!userHasCommentPermission(authUserData, ticket)) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const newMessage = await prisma.ticketMessage.create({
			data: {
				...data,
				userId: authUserData.userId,
			},
			include: {
				user: { select: { name: true } },
			},
		});

		res.json(newMessage);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta });
	}
};

const getLatestTicketMessages = async (req, res) => {
	const messagesAmount = parseInt(req.params.amount);
	authUserData = req.authData;

	if (isNaN(messagesAmount)) {
		return res.status(400).json({ error: 'Bad request' });
	}

	try {
		const messages = await prisma.ticketMessage.findMany({
			take: messagesAmount,
			orderBy: { createdAt: 'desc' },
			include: {
				user: { select: { name: true, email: true } },
				ticket: { select: { id: true, subject: true } },
			},
		});

		res.json(messages);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

module.exports = {
	createTicketMessage,
	getLatestTicketMessages,
};
