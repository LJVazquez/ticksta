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
		let tickets = [];

		if (userRole === 'ADMIN' || userRole === 'MANAGER') {
			tickets = await prisma.ticket.findMany({});
		}

		if (userRole === 'USER') {
			tickets = await prisma.ticket.findMany({
				where: { authorId: userId },
			});
		}

		if (userRole === 'DEV') {
			tickets = await prisma.ticket.findMany({
				where: { assignedToId: userId },
			});
		}

		res.json(tickets);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
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
			data: { ...data, authorId: authUserId },
		});

		res.json(newTicket);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

//* helper de getTicketById
const userHasReadPermission = (user, ticket) => {
	const userHasAllowedRole =
		user.userRole === 'ADMIN' || user.userRole === 'MANAGER';

	const userIsAssignedToProject = ticket.project.assignedUsers.some(
		(assignedUser) => assignedUser.id === user.userId
	);

	return userHasAllowedRole || userIsAssignedToProject;
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
				author: { select: { name: true } },
				assignedTo: { select: { name: true } },
				project: {
					include: {
						assignedUsers: { select: { id: true, name: true, role: true } },
					},
				},
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

		if (!userHasReadPermission(authUserData, ticket)) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		res.json(ticket);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
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
	authUserData = req.authData;

	const validationErrors = validateTicketUpdateData(
		data,
		authUserData.userRole
	);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const ticket = await prisma.ticket.findUnique({
			where: { id: ticketId },
		});

		if (
			authUserData.userRole === 'DEV' &&
			ticket.assignedToId !== authUserData.userId
		) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		if (!ticket) {
			return res.status(404).json({ error: 'Ticket no encontrado' });
		}

		const updatedTicket = await prisma.ticket.update({
			where: { id: ticketId },
			data: data,
			include: {
				author: { select: { name: true } },
				assignedTo: { select: { name: true } },
				project: {
					include: {
						assignedUsers: { select: { id: true, name: true, role: true } },
					},
				},
				ticketMessages: {
					include: {
						user: { select: { name: true } },
					},
					orderBy: { createdAt: 'desc' },
				},
			},
		});

		res.json(updatedTicket);
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
	updateTicket,
	getLatestTickets,
	getTicketStats,
};
