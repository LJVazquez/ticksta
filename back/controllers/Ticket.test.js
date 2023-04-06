const httpMocks = require('node-mocks-http');
const { PrismaClient } = require('@prisma/client');
const {
	getTickets,
	createTicket,
	getTicketById,
	getLatestTickets,
	updateTicket,
} = require('./Ticket');
const {
	validateTicketCreationData,
	validateTicketUpdateData,
} = require('../utils/schemaValidators');
const { userHasReadPermission } = require('./Ticket');
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
	const prismaMock = {
		ticket: {
			create: jest.fn(),
			findUnique: jest.fn(),
			findMany: jest.fn(),
			update: jest.fn(),
		},
		project: {
			findUnique: jest.fn(),
		},
	};

	return {
		PrismaClient: jest.fn(() => prismaMock),
	};
});

jest.mock('../utils/schemaValidators.js', () => {
	return {
		validateTicketCreationData: jest.fn(),
		validateTicketUpdateData: jest.fn(),
	};
});

const mockData = {
	admin: {
		userId: 1,
		userRole: 'ADMIN',
	},
	dev: {
		userId: 2,
		userRole: 'DEV',
	},
	manager: {
		userId: 3,
		userRole: 'MANAGER',
	},
	user: {
		userId: 4,
		userRole: 'USER',
	},
	ticket: {
		id: 1,
		title: 'Test ticket 1',
		description: 'Test description 1',
		status: 'OPEN',
		priority: 'LOW',
		authorId: 4,
		project: {
			id: 1,
			name: 'Test project 1',
			description: 'Test description 1',
			assignedUsers: [{ id: 4, userRole: 'USER' }],
		},
	},
};

let req, res;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
});

describe('getTickets', () => {
	const dataToInclude = {
		author: { select: { name: true } },
		assignedTo: { select: { name: true } },
	};

	it('should return status code 200 and an array of tickets if authUser is ADMIN', async () => {
		req.authData = mockData.admin;

		prisma.ticket.findMany.mockReturnValueOnce([mockData.ticket]);

		await getTickets(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual([mockData.ticket]);
		expect(prisma.ticket.findMany).toHaveBeenCalledWith({
			include: dataToInclude,
		});
	});

	it('should return status code 200 and an array of tickets if authUser is MANAGER', async () => {
		req.authData = mockData.manager;

		prisma.ticket.findMany.mockReturnValueOnce([mockData.ticket]);

		await getTickets(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual([mockData.ticket]);
		expect(prisma.ticket.findMany).toHaveBeenCalledWith({
			include: dataToInclude,
		});
	});

	it('should return status code 200 and an assigned tickets if authUser is DEV', async () => {
		const devFindManyOptions = {
			where: { assignedToId: mockData.dev.userId },
			include: dataToInclude,
		};

		req.authData = mockData.dev;

		await getTickets(req, res);

		expect(res.statusCode).toBe(200);
		expect(prisma.ticket.findMany).toHaveBeenCalledWith(devFindManyOptions);
	});

	it('should return status code 200 and an own tickets if authUser is USER', async () => {
		const userFindManyOptions = {
			where: { authorId: mockData.user.userId },
			include: dataToInclude,
		};

		req.authData = mockData.user;

		await getTickets(req, res);

		expect(res.statusCode).toBe(200);
		expect(prisma.ticket.findMany).toHaveBeenCalledWith(userFindManyOptions);
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authData = mockData.admin;

		const errorMessage = 'Some error';
		const error = new Error(errorMessage);

		prisma.ticket.findMany.mockRejectedValueOnce(error);

		await getTickets(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toEqual({ error: errorMessage });
		expect(prisma.ticket.findMany).toHaveBeenCalledWith({
			include: dataToInclude,
		});
	});
});

describe('createTicket', () => {
	it('should return status code 201 and the created ticket if the authUser is USER', async () => {
		req.authData = mockData.user;
		req.body = mockData.ticket;

		prisma.project.findUnique.mockReturnValueOnce(mockData.ticket.project);
		prisma.ticket.create.mockReturnValueOnce(mockData.ticket);
		validateTicketCreationData.mockReturnValueOnce(null);

		await createTicket(req, res);

		expect(res.statusCode).toBe(201);
		expect(res._getJSONData()).toEqual(mockData.ticket);
	});

	it('should return status code 401 and the error message if the authUser is not USER', async () => {
		req.authData = mockData.dev;
		req.body = mockData.ticket;

		prisma.project.findUnique.mockReturnValueOnce(mockData.ticket.project);
		validateTicketCreationData.mockReturnValueOnce(null);

		await createTicket(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unauthorized' });
	});

	it('should return status code 404 if the project does not exist', async () => {
		req.authData = mockData.user;
		req.body = mockData.ticket;

		prisma.project.findUnique.mockReturnValueOnce(null);
		validateTicketCreationData.mockReturnValueOnce(null);

		await createTicket(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 409 if the ticket data is not valid', async () => {
		req.authData = mockData.user;
		req.body = mockData.ticket;

		const errorsArr = ['Error 1', 'Error 2'];

		prisma.project.findUnique.mockReturnValueOnce(mockData.ticket.project);
		validateTicketCreationData.mockReturnValueOnce(errorsArr);

		await createTicket(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: errorsArr });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authData = mockData.user;
		req.body = mockData.ticket;

		const errorMessage = 'Some error';
		const error = new Error(errorMessage);

		prisma.project.findUnique.mockReturnValueOnce(mockData.ticket.project);
		prisma.ticket.create.mockRejectedValueOnce(error);
		validateTicketCreationData.mockReturnValueOnce(null);

		await createTicket(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toEqual({ error: errorMessage });
	});
});

describe('userHasReadPermission', () => {
	it('should return true if the authUser is ADMIN', () => {
		const result = userHasReadPermission(mockData.admin, mockData.ticket);

		expect(result).toBe(true);
	});

	it('should return true if the authUser is MANAGER', () => {
		const result = userHasReadPermission(mockData.manager, mockData.ticket);

		expect(result).toBe(true);
	});

	it('should return true if the authUser is DEV or USER and is assigned to the project', () => {
		const result = userHasReadPermission(mockData.user, mockData.ticket);

		expect(result).toBe(true);
	});

	it('should return false if the authUser is DEV or USER and is not assigned to the project', () => {
		const result = userHasReadPermission(mockData.dev, mockData.ticket);

		expect(result).toBe(false);
	});
});

describe('getTicketById', () => {
	it('should return status code 200 and the ticket if the authUser has read permission', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };

		prisma.ticket.findUnique.mockReturnValueOnce(mockData.ticket);

		await getTicketById(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual(mockData.ticket);
	});

	it('should return status code 400 if the ticket id is not a number', async () => {
		req.authData = mockData.admin;
		req.params = { id: 'not a number' };

		await getTicketById(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'Error en el id' });
	});

	it('should return status code 404 if the ticket does not exist', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };

		prisma.ticket.findUnique.mockReturnValueOnce(null);

		await getTicketById(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({ error: 'Ticket no encontrado' });
	});

	it('should return status code 401 if the authUser does not have read permission', async () => {
		req.authData = mockData.dev;
		req.params = { id: 1 };

		prisma.ticket.findUnique.mockReturnValueOnce(mockData.ticket);

		await getTicketById(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unauthorized' });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };

		const errorMessage = 'Some error';
		const error = new Error(errorMessage);

		prisma.ticket.findUnique.mockRejectedValueOnce(error);

		await getTicketById(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toEqual({ error: errorMessage });
	});
});

describe('getLatestTickets', () => {
	it('should return status code 200 and the tickets', async () => {
		req.authData = mockData.admin;
		req.params.amount = 1;

		prisma.ticket.findMany.mockReturnValueOnce(mockData.ticket);

		await getLatestTickets(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual(mockData.ticket);
	});

	it('should return status code 400 if the amount is not a number', async () => {
		req.authData = mockData.admin;
		req.params.amount = 'not a number';

		await getLatestTickets(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'Bad request' });
	});

	it('should return status code 400 if the amount is a negative number', async () => {
		req.authData = mockData.admin;
		req.params.amount = -1;

		await getLatestTickets(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'Bad request' });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authData = mockData.admin;
		req.params.amount = 1;

		const errorMessage = 'Some error';
		const error = new Error(errorMessage);

		prisma.ticket.findMany.mockRejectedValueOnce(error);

		await getLatestTickets(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toEqual({ error: errorMessage });
	});
});

describe('updateTicket', () => {
	it('should return status code 200 and the updated ticket', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };
		req.body = mockData.ticket;

		prisma.ticket.findUnique.mockReturnValueOnce(mockData.ticket);
		prisma.ticket.update.mockReturnValueOnce(mockData.ticket);

		await updateTicket(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual(mockData.ticket);
	});

	it('should return status code 409 if the body has malformed data', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };
		req.body = mockData.ticket;

		const errorsArr = ['Error 1', 'Error 2'];

		validateTicketUpdateData.mockReturnValueOnce(errorsArr);

		await updateTicket(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toEqual({ error: errorsArr });
	});

	it('should return status code 400 if the ticket id is not a number', async () => {
		req.authData = mockData.admin;
		req.params = { id: 'not a number' };
		req.body = mockData.ticket;

		await updateTicket(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'Bad request' });
	});

	it('should return status code 404 if the ticket does not exist', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };
		req.body = mockData.ticket;

		prisma.ticket.findUnique.mockReturnValueOnce(null);

		await updateTicket(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({ error: 'Ticket no encontrado' });
	});

	it('should return status code 401 if the authUser does not have update permission', async () => {
		req.authData = mockData.dev;
		req.params = { id: 1 };
		req.body = mockData.ticket;

		prisma.ticket.findUnique.mockReturnValueOnce(mockData.ticket);

		await updateTicket(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unauthorized' });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authData = mockData.admin;
		req.params = { id: 1 };
		req.body = mockData.ticket;

		const errorMessage = 'Some error';
		const error = new Error(errorMessage);

		prisma.ticket.findUnique.mockRejectedValueOnce(error);

		await updateTicket(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toEqual({ error: errorMessage });
	});
});
