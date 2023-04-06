const httpMocks = require('node-mocks-http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validateLoginData } = require('../utils/schemaValidators');
const {
	login,
	getLoggedUserData,
	getUserByEmail,
	createToken,
} = require('./Auth');

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
		validateLoginData: jest.fn(),
	};
});

bcrypt.compare = jest.fn();
jwt.sign = jest.fn();

const mockData = {
	user: {
		id: 1,
		name: 'test',
		email: 'email@test.com',
		password: '1234',
		role: 'USER',
	},
};

let req, res;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();

	jest.clearAllMocks();
});

describe('login', () => {
	it('should return 200 and a token if the login data is correct', async () => {
		req.body.email = mockData.user.email;
		req.body.password = mockData.user.password;

		validateLoginData.mockReturnValueOnce(null);

		prisma.user.findUnique.mockResolvedValueOnce(mockData.user);
		bcrypt.compare.mockResolvedValueOnce(true);
		jwt.sign.mockReturnValueOnce('token');

		await login(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toHaveProperty('jwt');
	});

	it('should return 409 if the login data is not valid', async () => {
		req.body.email = mockData.user.email;
		req.body.password = mockData.user.password;

		const errorsArr = ['error1', 'error2'];
		validateLoginData.mockReturnValueOnce(errorsArr);

		await login(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: errorsArr });
	});

	it('should return 401 if the user does not exist', async () => {
		req.body.email = mockData.user.email;
		req.body.password = mockData.user.password;

		validateLoginData.mockReturnValueOnce(null);

		prisma.user.findUnique.mockResolvedValueOnce(null);

		await login(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Email y/o contraseña incorrecto/s',
		});
	});

	it('should return 401 if the password does not match', async () => {
		req.body.email = mockData.user.email;
		req.body.password = mockData.user.password;

		validateLoginData.mockReturnValueOnce(null);

		prisma.user.findUnique.mockResolvedValueOnce(mockData.user);
		bcrypt.compare.mockResolvedValueOnce(false);

		await login(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Email y/o contraseña incorrecto/s',
		});
	});

	it('should return 500 and the error message if there is an error', async () => {
		req.body.email = mockData.user.email;
		req.body.password = mockData.user.password;

		const errorMsg = 'some error';
		const fakeError = new Error(errorMsg);

		validateLoginData.mockReturnValueOnce(null);
		prisma.user.findUnique.mockRejectedValueOnce(fakeError);

		await login(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('getLoggedUserData', () => {
	it('should return the authData from the request', () => {
		req.authData = mockData.user;
		getLoggedUserData(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(mockData.user);
	});
});

describe('getUserByEmail', () => {
	it('should return the user if it exists', async () => {
		prisma.user.findUnique.mockResolvedValueOnce(mockData.user);

		const user = await getUserByEmail(mockData.user.email);

		expect(user).toStrictEqual(mockData.user);
	});
});

describe('createToken', () => {
	it('should return a token', async () => {
		jwt.sign.mockReturnValueOnce('token');

		const token = await createToken(mockData.user);

		expect(token).toBe('token');
	});
});
