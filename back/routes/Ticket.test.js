const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = require('../app');
const apiRoute = process.env.API_ROUTE;
const ticketsRoute = `${apiRoute}/tickets`;

const testData = require('./testData.json');

let adminToken;
let managerToken;
let userToken;

let testProject;

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

	testProject = await prisma.project.create(testData.ticketstTestProject);
});

afterAll(async () => {
	await prisma.project.delete({
		where: {
			id: testProject.id,
		},
	});
});

describe('/', () => {
	describe('GET', () => {
		it('should return status code 200 and an array of tickets', async () => {
			const res = await request(app)
				.get(ticketsRoute)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toBeInstanceOf(Array);
			expect(res.body[0]).toHaveProperty('id');
			expect(res.body[0]).toHaveProperty('subject');
			expect(res.body[0]).toHaveProperty('description');
		});

		it('should return status code 401 if user is not logged in', async () => {
			const res = await request(app).get(ticketsRoute);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({ error: 'Invalid or missing token' });
		});
	});

	describe('POST', () => {
		it('should return status code 201 and the created ticket', async () => {
			const testTicket = {
				subject: 'Integration test Ticket',
				description: 'Mock ticket for tickets integration tests',
				status: 'OPEN',
				type: 'ISSUE',
				projectId: testProject.id,
				assignedToId: testData.dev.id,
			};

			const res = await request(app)
				.post(ticketsRoute)
				.set('Authorization', `Bearer ${userToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body).toHaveProperty('subject', testTicket.subject);
			expect(res.body).toHaveProperty('description', testTicket.description);
			expect(res.body).toHaveProperty('status', testTicket.status);
		});

		it('should return status code 409 if the data is invalid', async () => {
			const testTicket = {
				foo: 'bar',
			};

			const res = await request(app)
				.post(ticketsRoute)
				.set('Authorization', `Bearer ${userToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(409);
			expect(res.body).toHaveProperty('error');
		});

		it('should return status code 404 if the project does not exist', async () => {
			const testTicket = {
				subject: 'Integration test Ticket',
				description: 'Mock ticket for tickets integration tests',
				status: 'OPEN',
				type: 'ISSUE',
				projectId: 999,
				assignedToId: testData.dev.id,
			};

			const res = await request(app)
				.post(ticketsRoute)
				.set('Authorization', `Bearer ${userToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(404);
			expect(res.body).toStrictEqual({ error: 'Proyecto no encontrado' });
		});

		it('should return status code 401 if user is not logged in', async () => {
			const testTicket = {
				subject: 'Integration test Ticket',
				description: 'Mock ticket for tickets integration tests',
				status: 'OPEN',
				type: 'ISSUE',
				projectId: testProject.id,
				assignedToId: testData.dev.id,
			};

			const res = await request(app).post(ticketsRoute).send(testTicket);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({ error: 'Invalid or missing token' });
		});

		it('should return status code 403 if user is not authorized', async () => {
			const testTicket = {
				subject: 'Integration test Ticket',
				description: 'Mock ticket for tickets integration tests',
				status: 'OPEN',
				type: 'ISSUE',
				projectId: testProject.id,
				assignedToId: testData.dev.id,
			};

			const res = await request(app)
				.post(ticketsRoute)
				.set('Authorization', `Bearer ${managerToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(403);
			expect(res.body).toStrictEqual({ error: 'Unauthorized' });
		});
	});
});

describe('/:id', () => {
	describe('/GET', () => {
		it('should return status code 200 and the ticket', async () => {
			const res = await request(app)
				.get(`${ticketsRoute}/${testProject.tickets[0].id}`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('id', testProject.tickets[0].id);
			expect(res.body).toHaveProperty(
				'subject',
				testProject.tickets[0].subject
			);
			expect(res.body).toHaveProperty(
				'description',
				testProject.tickets[0].description
			);
		});

		it('should return status code 400 if the id is not a number', async () => {
			const res = await request(app)
				.get(`${ticketsRoute}/notanumber`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(400);
			expect(res.body).toStrictEqual({ error: 'Error en el id' });
		});

		it('should return status code 404 if the ticket does not exist', async () => {
			const res = await request(app)
				.get(`${ticketsRoute}/999`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toStrictEqual({ error: 'Ticket no encontrado' });
		});

		it('should return status code 401 if user is not logged in', async () => {
			const res = await request(app).get(
				`${ticketsRoute}/${testProject.tickets[0].id}`
			);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({ error: 'Invalid or missing token' });
		});
	});

	describe('/PATCH', () => {
		it('should return status code 200 and the updated ticket', async () => {
			const testTicket = {
				subject: 'Updated subject',
				description: 'Updated description',
			};

			const res = await request(app)
				.patch(`${ticketsRoute}/${testProject.tickets[0].id}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('subject', testTicket.subject);
			expect(res.body).toHaveProperty('description', testTicket.description);
		});

		it('should return status code 409 if the data is invalid', async () => {
			const testTicket = {
				foo: 'bar',
			};

			const res = await request(app)
				.patch(`${ticketsRoute}/${testProject.tickets[0].id}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(409);
			expect(res.body).toHaveProperty('error');
		});

		it('should return status code 404 if the ticket does not exist', async () => {
			const testTicket = {
				subject: 'Updated subject',
				description: 'Updated description',
			};

			const res = await request(app)
				.patch(`${ticketsRoute}/999`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(404);
			expect(res.body).toStrictEqual({ error: 'Ticket no encontrado' });
		});

		it('should return status code 400 if the id is not a number', async () => {
			const testTicket = {
				subject: 'Updated subject',
				description: 'Updated description',
			};

			const res = await request(app)
				.patch(`${ticketsRoute}/notanumber`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send(testTicket);

			expect(res.statusCode).toBe(400);
			expect(res.body).toStrictEqual({ error: 'Bad request' });
		});
	});
});

describe('/latest/:amount', () => {
	it('should return status code 200 and the latest tickets', async () => {
		const ticketAmount = 2;

		const res = await request(app)
			.get(`${ticketsRoute}/latest/${ticketAmount}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveLength(ticketAmount);
		expect(res.body[0]).toHaveProperty('description');
		expect(res.body[0]).toHaveProperty('subject');
	});

	it('should return status code 400 if the amount is not a number', async () => {
		const res = await request(app)
			.get(`${ticketsRoute}/latest/notanumber`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(400);
		expect(res.body).toStrictEqual({ error: 'Bad request' });
	});

	it('should return status code 401 if user is not logged in', async () => {
		const res = await request(app).get(`${ticketsRoute}/latest/2`);

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({ error: 'Invalid or missing token' });
	});

	it('should return status code 400 if the amount is less than 1', async () => {
		const res = await request(app)
			.get(`${ticketsRoute}/latest/0`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(400);
		expect(res.body).toStrictEqual({ error: 'Bad request' });
	});
});
