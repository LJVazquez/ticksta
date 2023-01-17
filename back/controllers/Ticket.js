const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTickets = async (req, res) => {
	try {
		const tickets = await prisma.ticket.findMany({});

		res.json(tickets);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const createTicket = async (req, res) => {
	const data = req.body;
	const authUserId = req.authData.userId;

	try {
		const newTicket = await prisma.ticket.create({
			data: { ...data, userId: authUserId },
		});

		res.json(newTicket);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const getTicketById = async (req, res) => {
	const ticketId = parseInt(req.params.id);
	authUserData = req.authData;

	try {
		const ticket = await prisma.ticket.findUnique({
			where: { id: ticketId },
			include: {
				ticketMessages: { include: { user: { select: { name: true } } } },
			},
		});

		if (
			authUserData.userRole !== 'ADMIN' &&
			ticket.userId !== authUserData.userId
		) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		res.json(ticket);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const getTicketsByUserId = async (req, res) => {
	const userId = parseInt(req.params.id);
	authUserData = req.authData;

	if (authUserData.userRole !== 'ADMIN' && userId !== authUserData.userId) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const tickets = await prisma.ticket.findMany({
			where: { userId: userId },
		});
		res.json(tickets);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const updateTicket = async (req, res) => {
	const ticketId = parseInt(req.params.id);
	const data = req.body;

	try {
		const updatedTicket = await prisma.ticket.update({
			where: { id: ticketId },
			data: data,
		});

		res.json(updatedTicket);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const createTicketMessage = async (req, res) => {
	const data = req.body;
	const ticketId = parseInt(req.params.id);
	const authUserData = req.authData;

	try {
		const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

		if (
			authUserData.userRole !== 'ADMIN' &&
			ticket.userId !== authUserData.userId
		) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const newMessage = await prisma.ticketMessage.create({
			data: { ...data, ticketId, userId: authUserData.userId },
		});

		res.json(newMessage);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

module.exports = {
	getTickets,
	getTicketById,
	createTicket,
	getTicketsByUserId,
	updateTicket,
	createTicketMessage,
};
