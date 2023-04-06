const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

const { authorizeUser, authorizeRole } = require('./authMiddleware');

jest.mock('jsonwebtoken');
jwt.verify = jest.fn();

let req, res, next;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

describe('authorizeUser', () => {
	it('should return the decoded token', async () => {
		req.headers.authorization = 'Bearer token';

		jwt.verify.mockReturnValueOnce({ userRole: 'ADMIN' });

		await authorizeUser(req, res, next);

		expect(req.authData).toEqual({ userRole: 'ADMIN' });
		expect(next).toHaveBeenCalled();
	});

	it('should return status code 401 if there is no token', async () => {
		await authorizeUser(req, res, next);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toEqual({ error: 'Invalid or missing token' });
	});

	it('should return status code 500 if the token is invalid', async () => {
		req.headers.authorization = 'Bearer token';

		const errorMsg = 'invalid signature';
		const fakeError = new Error(errorMsg);

		jwt.verify.mockRejectedValueOnce(fakeError);

		await authorizeUser(req, res, next);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toEqual({ error: errorMsg });
	});

	it('should return status code 401 if the token is expired', async () => {
		req.headers.authorization = 'Bearer token';

		const errorMsg = 'jwt expired';
		const fakeError = new Error(errorMsg);
		fakeError.name = 'TokenExpiredError';

		jwt.verify.mockRejectedValueOnce(fakeError);

		await authorizeUser(req, res, next);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toEqual({ error: errorMsg });
	});
});

describe('authorizeRole', () => {
	it('should call next if the authUser role is the specified role', () => {
		req.authData = { userRole: 'ADMIN' };

		const _authorizeRole = authorizeRole('ADMIN');
		_authorizeRole(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should call next if the authUser role is in the specified roles list', () => {
		req.authData = { userRole: 'USER' };

		const _authorizeRole = authorizeRole(['ADMIN', 'USER']);

		_authorizeRole(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should return status code 403 if the authUser role is not the specified role', () => {
		req.authData = { userRole: 'USER' };

		const _authorizeRole = authorizeRole('ADMIN');
		_authorizeRole(req, res, next);

		expect(res.statusCode).toBe(403);
		expect(res._getJSONData()).toEqual({ error: 'Unauthorized' });
	});

	it('should return status code 403 if the authUser role is not in the specified roles list', () => {
		req.authData = { userRole: 'USER' };

		const _authorizeRole = authorizeRole(['ADMIN', 'MANAGER']);
		_authorizeRole(req, res, next);

		expect(res.statusCode).toBe(403);
		expect(res._getJSONData()).toEqual({ error: 'Unauthorized' });
	});
});
