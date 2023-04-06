const httpMocks = require('node-mocks-http');
const { PrismaClient } = require('@prisma/client');
const {
	getUsers,
	getAssignableUsers,
	createUser,
	updateUser,
	getUserById,
	getUserByEmail,
} = require('./User');
const {
	validateUserCreationData,
	validateUserUpdateData,
} = require('../utils/schemaValidators');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

jest.mock('@prisma/client', () => {
	const prismaMock = {
		user: {
			create: jest.fn(),
			findUnique: jest.fn(),
			findMany: jest.fn(),
			update: jest.fn(),
		},
	};

	return {
		PrismaClient: jest.fn(() => prismaMock),
	};
});

jest.mock('../utils/schemaValidators.js', () => {
	return {
		validateUserCreationData: jest.fn(),
		validateUserUpdateData: jest.fn(),
	};
});

bcrypt.hash = jest.fn();

const mockData = {
	user: {
		id: 1,
		name: 'Test user',
		email: 'email@test.com',
		role: 'USER',
		password: '1234',
	},
	reqAdmin: {
		userId: 0,
		userRole: 'ADMIN',
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

	jest.clearAllMocks();
});

describe('getUsers', () => {
	it('should return status code 200 and all users', async () => {
		req.authUser = mockData.reqAdmin;

		prisma.user.findMany.mockResolvedValue([mockData.user]);

		await getUsers(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual([mockData.user]);
	});

	it('should not return the password of the users', async () => {
		req.authUser = mockData.reqAdmin;

		prisma.user.findMany.mockResolvedValue([mockData.user]);

		await getUsers(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()[0].password).toBeUndefined();
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		req.authUser = mockData.reqAdmin;
		prisma.user.findMany.mockRejectedValue(fakeError);

		await getUsers(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('getAssignableUsers', () => {
	it('should return status code 200 and all assignable users', async () => {
		const getAssignableUsersFindManyOptions = {
			where: {
				OR: [{ role: 'USER' }, { role: 'DEV' }],
			},
		};

		req.authUser = mockData.reqAdmin;

		prisma.user.findMany.mockResolvedValue([mockData.user]);

		await getAssignableUsers(req, res);

		expect(res.statusCode).toBe(200);
		expect(prisma.user.findMany).toHaveBeenCalledWith(
			getAssignableUsersFindManyOptions
		);
		expect(res._getJSONData()).toStrictEqual([mockData.user]);
	});

	it('should not return the password of the users', async () => {
		req.authUser = mockData.reqAdmin;

		prisma.user.findMany.mockResolvedValue([mockData.user]);

		await getAssignableUsers(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()[0].password).toBeUndefined();
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		req.authUser = mockData.reqAdmin;
		prisma.user.findMany.mockRejectedValue(fakeError);

		await getAssignableUsers(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('createUser', () => {
	it('should return status code 201 and the created user', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;

		prisma.user.create.mockResolvedValue(mockData.user);
		validateUserCreationData.mockReturnValueOnce(null);
		bcrypt.hash.mockResolvedValueOnce('hashedPassword');

		await createUser(req, res);

		expect(res.statusCode).toBe(201);
		expect(res._getJSONData()).toStrictEqual(mockData.user);
	});

	it('should not return the password of the user', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;

		prisma.user.create.mockResolvedValue(mockData.user);
		validateUserCreationData.mockReturnValueOnce(null);
		bcrypt.hash.mockResolvedValueOnce('hashedPassword');

		await createUser(req, res);

		expect(res.statusCode).toBe(201);
		expect(res._getJSONData().password).toBeUndefined();
	});

	it('should return status code 409 if the user data is invalid', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;

		const errorArr = ['error1', 'error2'];
		validateUserCreationData.mockReturnValueOnce(errorArr);

		await createUser(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: errorArr });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;

		prisma.user.create.mockRejectedValue(fakeError);

		await createUser(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('updateUser', () => {
	it('should return status code 200 and the updated user', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;
		req.params = { id: 1 };

		prisma.user.update.mockResolvedValue(mockData.user);
		validateUserUpdateData.mockReturnValueOnce(null);

		await updateUser(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(mockData.user);
	});

	it('should not return the password of the user', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;
		req.params = { id: 1 };

		prisma.user.update.mockResolvedValue(mockData.user);
		validateUserUpdateData.mockReturnValueOnce(null);

		await updateUser(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData().password).toBeUndefined();
	});

	it('should return status code 409 if the user data is invalid', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;
		req.params = { id: 1 };

		const errorArr = ['error1', 'error2'];
		validateUserUpdateData.mockReturnValueOnce(errorArr);

		await updateUser(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: errorArr });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;
		req.params = { id: 1 };

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		prisma.user.update.mockRejectedValue(fakeError);

		await updateUser(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if the user id is not a number', async () => {
		req.authUser = mockData.reqAdmin;
		req.body = mockData.user;
		req.params = { id: 'not a number' };

		await updateUser(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'Error en el id' });
	});
});

describe('getUserById', () => {
	it('should return status code 200 and the user', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { id: 1 };

		prisma.user.findUnique.mockResolvedValue(mockData.user);

		await getUserById(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(mockData.user);
	});

	it('should not return the password of the user', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { id: 1 };

		prisma.user.findUnique.mockResolvedValue(mockData.user);

		await getUserById(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData().password).toBeUndefined();
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { id: 1 };

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		prisma.user.findUnique.mockRejectedValue(fakeError);

		await getUserById(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if the user id is not a number', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { id: 'not a number' };

		await getUserById(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'Error en el id' });
	});

	it('should return status code 404 if the user does not exist', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { id: 1 };

		prisma.user.findUnique.mockResolvedValue(null);

		await getUserById(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Usuario no encontrado',
		});
	});
});

describe('getUserByEmail', () => {
	it('should return status code 200 and the user', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { email: 'email@test.com' };

		prisma.user.findUnique.mockResolvedValue(mockData.user);

		await getUserByEmail(req, res);

		expect(res.statusCode).toBe(200);

		expect(res._getJSONData()).toStrictEqual(mockData.user);
	});

	it('should not return the password of the user', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { email: 'email@test.com' };

		prisma.user.findUnique.mockResolvedValue(mockData.user);

		await getUserByEmail(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData().password).toBeUndefined();
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { email: 'email@test.com' };

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);

		prisma.user.findUnique.mockRejectedValue(fakeError);

		await getUserByEmail(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 404 if the user does not exist', async () => {
		req.authUser = mockData.reqAdmin;
		req.params = { email: 'email@test.com' };

		prisma.user.findUnique.mockResolvedValue(null);

		await getUserByEmail(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Usuario no encontrado',
		});
	});
});
