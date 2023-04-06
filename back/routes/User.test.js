const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = require('../app');

const apiRoute = process.env.API_ROUTE;
const usersRoute = `${apiRoute}/users`;

const testData = require('./testData.json');

let testUser;

const testUserData = {
	name: 'Test user',
	email: 'testemail@integrationtest.com',
	role: 'USER',
	password: '123456',
};

beforeAll(async () => {
	const adminRes = await request(app)
		.post(`${apiRoute}/auth/login`)
		.send(testData.adminCredentials);

	adminToken = adminRes.body.jwt;

	const managerRes = await request(app)
		.post(`${apiRoute}/auth/login`)
		.send(testData.managerCredentials);

	managerToken = managerRes.body.jwt;

	const userRes = await request(app)
		.post(`${apiRoute}/auth/login`)
		.send(testData.userCredentials);

	userToken = userRes.body.jwt;
});

afterAll(async () => {
	await prisma.user.delete({
		where: {
			id: testUser.id,
		},
	});
});

describe('/', () => {
	describe('GET', () => {
		it('should return 200 and an array of users', async () => {
			const res = await request(app)
				.get(usersRoute)
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200);

			expect(res.body).toBeInstanceOf(Array);
			expect(res.body[0]).toHaveProperty('id');
			expect(res.body[0]).toHaveProperty('name');
			expect(res.body[0]).toHaveProperty('email');
			//!should not have sensitive data
			expect(res.body[0]).not.toHaveProperty('password');
		});

		it('should return status code 403 if not authorized', async () => {
			const res = await request(app)
				.get(usersRoute)
				.set('Authorization', `Bearer ${userToken}`);

			expect(res.status).toBe(403);
			expect(res.body).toStrictEqual({ error: 'Unauthorized' });
		});
	});

	describe('POST', () => {
		it('should return 201 and the created user', async () => {
			const res = await request(app)
				.post(usersRoute)
				.send(testUserData)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body).toHaveProperty('name', testUserData.name);
			expect(res.body).toHaveProperty('email', testUserData.email);
			expect(res.body).toHaveProperty('role', testUserData.role);

			expect(res.body).not.toHaveProperty('password');

			testUser = res.body;
		});

		it('should return status code 409 if the data is invalid', async () => {
			const testUser = {
				foo: 'bar',
			};
			const res = await request(app)
				.post(usersRoute)
				.send(testUser)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(409);
			expect(res.body).toHaveProperty('error');
		});
	});
});

describe('/:id', () => {
	describe('GET', () => {
		it('should return 200 and the user', async () => {
			const res = await request(app)
				.get(`${usersRoute}/${testUser.id}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200);

			expect(res.body).toHaveProperty('name', testUser.name);
			expect(res.body).toHaveProperty('email', testUser.email);
			expect(res.body).toHaveProperty('role', testUser.role);
		});

		it('should return status code 403 if not authorized', async () => {
			const res = await request(app)
				.get(`${usersRoute}/${testData.dev.id}`)
				.set('Authorization', `Bearer ${userToken}`);

			expect(res.status).toBe(403);
			expect(res.body).toStrictEqual({ error: 'Unauthorized' });
		});

		it('should return status code 400 if the id is invalid', async () => {
			const res = await request(app)
				.get(`${usersRoute}/notanumber`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({ error: 'Error en el id' });
		});

		it('should return status code 404 if the user does not exist', async () => {
			const res = await request(app)
				.get(`${usersRoute}/999999999`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
			expect(res.body).toStrictEqual({ error: 'Usuario no encontrado' });
		});
	});

	describe('/PATCH', () => {
		it('should return 200 and the updated user', async () => {
			const res = await request(app)
				.patch(`${usersRoute}/${testUser.id}`)
				.send({ name: 'Updated name' })
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name', 'Updated name');

			testUser = res.body;
		});

		it('should return status code 403 if not authorized', async () => {
			const res = await request(app)
				.patch(`${usersRoute}/${testUser.id}`)
				.send(testUserData)
				.set('Authorization', `Bearer ${userToken}`);

			expect(res.status).toBe(403);
			expect(res.body).toStrictEqual({ error: 'Unauthorized' });
		});

		it('should return status code 400 if the id is invalid', async () => {
			const res = await request(app)
				.patch(`${usersRoute}/notanumber`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({ error: 'Error en el id' });
		});

		it('should return status code 409 if the data is invalid', async () => {
			const res = await request(app)
				.patch(`${usersRoute}/${testUser.id}`)
				.send({ foo: 'bar' })
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(409);
			expect(res.body).toHaveProperty('error');
		});
	});
});

describe('/assignable', () => {
	it('should return status code 200 and an array of users', async () => {
		const res = await request(app)
			.get(`${usersRoute}/assignable`)
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200);

		expect(res.body).toBeInstanceOf(Array);
		expect(res.body[0]).toHaveProperty('id');
		expect(res.body[0]).toHaveProperty('name');
		expect(res.body[0]).toHaveProperty('email');

		expect(res.body[0]).not.toHaveProperty('password');
	});

	it('should return status code 403 if not authorized', async () => {
		const res = await request(app)
			.get(`${usersRoute}/assignable`)
			.set('Authorization', `Bearer ${userToken}`);

		expect(res.status).toBe(403);
		expect(res.body).toStrictEqual({ error: 'Unauthorized' });
	});
});
