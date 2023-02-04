const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
	validateTicketCreationData,
	validateTicketUpdateData,
	validateTicketMessageCreationData,
} = require('../utils/schemaValidators.js');

const getTickets = async (req, res) => {
	const { userId, userRole } = req.authData;

	try {
		let tickets;

		if (userRole === 'ADMIN') {
			tickets = await prisma.ticket.findMany({});
		} else {
			tickets = await prisma.ticket.findMany({
				where: { userId: userId },
			});
		}

		res.json(tickets);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const createTicket = async (req, res) => {
	const data = req.body;
	const authUserId = req.authData.userId;

	const validationErrors = validateTicketCreationData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const newTicket = await prisma.ticket.create({
			data: { ...data, userId: authUserId },
		});

		res.json(newTicket);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const getTicketById = async (req, res) => {
	const ticketId = parseInt(req.params.id);
	authUserData = req.authData;

	if (isNaN(ticketId)) {
		return res.status(400).json({ error: 'Error en el id' });
	}

	try {
		const ticket = await prisma.ticket.findUnique({
			where: { id: ticketId },
			include: {
				user: { select: { name: true } },
				ticketMessages: {
					include: {
						user: { select: { name: true } },
					},
					orderBy: { createdAt: 'desc' },
				},
			},
		});

		if (!ticket) {
			return res.status(404).json({ error: 'Ticket no encontrado' });
		}

		if (
			authUserData.userRole !== 'ADMIN' &&
			ticket.userId !== authUserData.userId
		) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		res.json(ticket);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
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
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const getLatestTickets = async (req, res) => {
	const ticketsAmount = parseInt(req.params.amount);
	authUserData = req.authData;

	if (isNaN(ticketsAmount)) {
		return res.status(400).json({ error: 'Bad request' });
	}

	try {
		const tickets = await prisma.ticket.findMany({
			take: ticketsAmount,
			orderBy: { createdAt: 'desc' },
		});

		res.json(tickets);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const updateTicket = async (req, res) => {
	const ticketId = parseInt(req.params.id);
	const data = req.body;

	const validationErrors = validateTicketUpdateData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const updatedTicket = await prisma.ticket.update({
			where: { id: ticketId },
			data: data,
			include: {
				user: { select: { name: true } },
			},
		});

		res.json(updatedTicket);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const createTicketMessage = async (req, res) => {
	const data = req.body;
	const ticketId = parseInt(req.params.id);
	const authUserData = req.authData;

	const validationErrors = validateTicketMessageCreationData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

		if (
			authUserData.userRole !== 'ADMIN' &&
			ticket.userId !== authUserData.userId
		) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const newMessage = await prisma.ticketMessage.create({
			data: {
				...data,
				ticketId,
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

const getLatestMessages = async (req, res) => {
	const messagesAmount = parseInt(req.params.amount);
	authUserData = req.authData;

	try {
		const messages = await prisma.ticketMessage.findMany({
			take: messagesAmount,
			orderBy: { createdAt: 'desc' },
		});

		res.json(messages);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const getTicketStats = async (req, res) => {
	try {
		const tickets = await prisma.ticket.findMany({ select: { status: true } });

		const ticketStatuses = tickets.map((ticket) => ticket.status);
		const statusCount = {};

		ticketStatuses.forEach((status) => {
			if (statusCount.hasOwnProperty(status)) {
				statusCount[status] = statusCount[status] + 1;
			} else {
				statusCount[status] = 1;
			}
		});

		res.json(statusCount);
	} catch (e) {
		console.error(e);
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
	getLatestTickets,
	getLatestMessages,
	getTicketStats,
};
