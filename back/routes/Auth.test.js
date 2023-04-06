const request = require('supertest');
const app = require('../app');

const apiRoute = process.env.API_ROUTE;

const testData = require('./testData.json');

let token;

describe('/login', () => {
	describe('POST', () => {
		it('should return status code 200 and a token if the login data is correct', async () => {
			const res = await request(app)
				.post(`${apiRoute}/auth/login`)
				.send(testData.adminCredentials);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('jwt');

			token = res.body.jwt;
		});

		it('should return status code 401 if the email is incorrect', async () => {
			const res = await request(app).post(`${apiRoute}/auth/login`).send({
				email: 'error@email.com',
				password: testData.adminCredentials.password,
			});

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Email y/o contraseña incorrecto/s',
			});
		});

		it('should return status code 401 if the password is incorrect', async () => {
			const res = await request(app).post(`${apiRoute}/auth/login`).send({
				email: testData.adminCredentials.email,
				password: 'bad password',
			});

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Email y/o contraseña incorrecto/s',
			});
		});

		it('should return status code 409 on invalid request params', async () => {
			const res = await request(app).post(`${apiRoute}/auth/login`).send({
				badParam: 'foo',
			});

			expect(res.statusCode).toBe(409);
			expect(res.body).toHaveProperty('error');
		});
	});
});

describe('/user-data', () => {
	describe('POST', () => {
		it('should return status code 200 and the logged user data if the token is valid', async () => {
			const res = await request(app)
				.post(`${apiRoute}/auth/user-data`)
				.set('authorization', `Bearer ${token}`);

			expect(res.statusCode).toBe(200);

			expect(res.body).toHaveProperty('userId');
			expect(res.body).toHaveProperty('email', 'admin@ticksta.com');
			expect(res.body).toHaveProperty('userRole', 'ADMIN');
			expect(res.body).toHaveProperty('name', 'Test Admin');
		});
	});
});
