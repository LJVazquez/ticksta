const httpMocks = require('node-mocks-http');
const { PrismaClient } = require('@prisma/client');
const {
	userHasCommentPermission,
	createTicketMessage,
	getLatestTicketMessages,
} = require('./TicketMessage');
const {
	validateTicketMessageCreationData,
} = require('../utils/schemaValidators');

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
	const prismaMock = {
		ticket: {
			findUnique: jest.fn(),
		},
		ticketMessage: {
			create: jest.fn(),
			findMany: jest.fn(),
		},
	};

	return {
		PrismaClient: jest.fn(() => prismaMock),
	};
});

jest.mock('../utils/schemaValidators.js', () => {
	return {
		validateTicketMessageCreationData: jest.fn(),
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
		assignedToId: 10,
	},
	ticketMessage: {
		message: 'Test message 1',
		ticketId: 1,
		userId: 4,
	},
};

let req, res;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();

	jest.resetAllMocks();
});

describe('userHasCommentPermission', () => {
	it('should return true if user is admin', () => {
		const result = userHasCommentPermission(mockData.admin, mockData.ticket);

		expect(result).toBe(true);
	});

	it('should return true if user is manager', () => {
		const result = userHasCommentPermission(mockData.manager, mockData.ticket);

		expect(result).toBe(true);
	});

	it('should return true if user is author of ticket', () => {
		const result = userHasCommentPermission(mockData.user, mockData.ticket);

		expect(result).toBe(true);
	});

	it('should return false if the user is not admin, manager, author of ticket, or assigned to ticket', () => {
		const result = userHasCommentPermission(mockData.dev, mockData.ticket);

		expect(result).toBe(false);
	});

	it('should return true if user is assigned to ticket', () => {
		const anotherDev = { ...mockData.dev, userId: 10 };

		const result = userHasCommentPermission(anotherDev, mockData.ticket);

		expect(result).toBe(true);
	});
});

describe('createTicketMessage', () => {
	it('should return status code 201 and the ticket if its created', async () => {
		req.body = mockData.ticketMessage;
		req.authData = mockData.manager;

		prisma.ticket.findUnique.mockResolvedValue(mockData.ticket);
		prisma.ticketMessage.create.mockResolvedValue(mockData.ticketMessage);
		validateTicketMessageCreationData.mockReturnValue(null);

		await createTicketMessage(req, res);

		expect(res.statusCode).toBe(201);
		expect(res._getJSONData()).toStrictEqual(mockData.ticketMessage);
	});

	it('should return status code 409 if the ticket message data is invalid', async () => {
		req.body = mockData.ticketMessage;
		req.authData = mockData.manager;

		prisma.ticket.findUnique.mockResolvedValue(mockData.ticket);
		prisma.ticketMessage.create.mockResolvedValue(mockData.ticketMessage);

		const errorsArr = ['error1', 'error2'];
		validateTicketMessageCreationData.mockReturnValue(errorsArr);

		await createTicketMessage(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: errorsArr });
	});

	it('should return status code 409 if the ticket is CLOSED', async () => {
		req.body = mockData.ticketMessage;
		req.authData = mockData.manager;

		const closedTicket = { ...mockData.ticket, status: 'CLOSED' };

		prisma.ticket.findUnique.mockResolvedValue(closedTicket);

		await createTicketMessage(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: 'Ticket closed' });
	});

	it('should return status code 401 if the user does not have permission to comment on the ticket', async () => {
		req.body = mockData.ticketMessage;
		req.authData = mockData.dev;

		prisma.ticket.findUnique.mockResolvedValue(mockData.ticket);

		await createTicketMessage(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unauthorized' });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.body = mockData.ticketMessage;
		req.authData = mockData.manager;

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		prisma.ticket.findUnique.mockResolvedValue(mockData.ticket);
		prisma.ticketMessage.create.mockRejectedValue(fakeError);

		await createTicketMessage(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('getLatestTicketMessages', () => {
	it('should return status code 200 and the ticket messages if they are found', async () => {
		req.params.amount = 10;

		const fakeTicketMessages = [mockData.ticketMessage, mockData.ticketMessage];
		prisma.ticketMessage.findMany.mockResolvedValue(fakeTicketMessages);

		await getLatestTicketMessages(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(fakeTicketMessages);
	});

	it('should return status code 400 if the amount is not a number', async () => {
		req.params.amount = 'not a number';

		await getLatestTicketMessages(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Bad request',
		});
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.params.amount = 10;

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		prisma.ticketMessage.findMany.mockRejectedValue(fakeError);

		await getLatestTicketMessages(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});
