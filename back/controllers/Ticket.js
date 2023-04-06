const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
	validateTicketCreationData,
	validateTicketUpdateData,
} = require('../utils/schemaValidators.js');

const getTickets = async (req, res) => {
	const { userId, userRole } = req.authData;

	const dataToInclude = {
		author: { select: { name: true } },
		assignedTo: { select: { name: true } },
	};

	try {
		let tickets = [];

		if (userRole === 'ADMIN' || userRole === 'MANAGER') {
			tickets = await prisma.ticket.findMany({ include: dataToInclude });
		}

		if (userRole === 'USER') {
			tickets = await prisma.ticket.findMany({
				where: { authorId: userId },
				include: dataToInclude,
			});
		}

		if (userRole === 'DEV') {
			tickets = await prisma.ticket.findMany({
				where: { assignedToId: userId },
				include: dataToInclude,
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
		const project = await prisma.project.findUnique({
			where: { id: parseInt(data.projectId) },
			include: { assignedUsers: { select: { id: true } } },
		});

		if (!project) {
			return res.status(404).json({ error: 'Proyecto no encontrado' });
		}

		const userIsAssignedToProject = project.assignedUsers.some(
			(assignedUser) => assignedUser.id === authUserId
		);

		if (!userIsAssignedToProject) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const newTicket = await prisma.ticket.create({
			data: {
				...data,
				projectId: parseInt(data.projectId),
				authorId: authUserId,
			},
		});

		res.status(201).json(newTicket);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
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

	if (isNaN(ticketsAmount) || ticketsAmount < 1) {
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
		res.status(500).json({ error: e.message });
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

	if (isNaN(ticketId)) {
		return res.status(400).json({ error: 'Bad request' });
	}

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
		res.status(500).json({ error: e.message });
	}
};

module.exports = {
	getTickets,
	getTicketById,
	createTicket,
	updateTicket,
	getLatestTickets,
	userHasReadPermission,
};
