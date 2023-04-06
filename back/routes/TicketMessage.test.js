const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = require('../app');

const apiRoute = process.env.API_ROUTE;
const ticketMessagesRoute = `${apiRoute}/ticketmessages`;

const testData = require('./testData.json');

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

	testProject = await prisma.project.create(testData.ticketMessagesTestProject);
});

afterAll(async () => {
	await prisma.project.delete({
		where: {
			id: testProject.id,
		},
	});
});

describe('/', () => {
	it('should return status code 201 and the created ticket message', async () => {
		const res = await request(app)
			.post(`${ticketMessagesRoute}`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({
				ticketId: testProject.tickets[0].id,
				message: 'Mock ticket message',
			});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('message', 'Mock ticket message');
	});

	it('should return status code 409 if the data is invalid', async () => {
		const res = await request(app)
			.post(`${ticketMessagesRoute}`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({
				ticketId: testProject.tickets[0].id,
				foo: 'bar',
			});

		expect(res.statusCode).toBe(409);
	});

	it('should return status code 409 if the ticket is closed', async () => {
		const res = await request(app)
			.post(`${ticketMessagesRoute}`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({
				ticketId: testProject.tickets[1].id,
				message: 'Mock ticket message',
			});

		expect(res.statusCode).toBe(409);
	});

	it('should return status code 401 if the user is not authenticated', async () => {
		const res = await request(app).post(`${ticketMessagesRoute}`).send({
			ticketId: testProject.tickets[0].id,
			message: 'Mock ticket message',
		});

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({ error: 'Invalid or missing token' });
	});

	it(' should return status code 401 if the user is not the author or assigned to the ticket', async () => {
		const res = await request(app)
			.post(`${ticketMessagesRoute}`)
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				ticketId: testProject.tickets[0].id,
				message: 'Mock ticket message',
			});

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({ error: 'Unauthorized' });
	});
});

describe('/latest/:amount', () => {
	it('should return status code 200 and an array of the amount of ticket messages requested', async () => {
		const firstAmount = 3;
		const res = await request(app)
			.get(`${ticketMessagesRoute}/latest/${firstAmount}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
		expect(res.body).toHaveLength(firstAmount);

		const secondAmount = 2;
		const secondRes = await request(app)
			.get(`${ticketMessagesRoute}/latest/${secondAmount}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(secondRes.statusCode).toBe(200);
		expect(secondRes.body).toBeInstanceOf(Array);
		expect(secondRes.body).toHaveLength(secondAmount);
	});

	it('should return status code 401 if user is not logged in', async () => {
		const res = await request(app).get(`${ticketMessagesRoute}/latest/3`);

		expect(res.statusCode).toBe(401);
	});

	it('should return status code 403 if user is not an admin', async () => {
		const res = await request(app)
			.get(`${ticketMessagesRoute}/latest/3`)
			.set('Authorization', `Bearer ${managerToken}`);

		expect(res.statusCode).toBe(403);
	});

	it('should return status code 400 if amount is not a number', async () => {
		const res = await request(app)
			.get(`${ticketMessagesRoute}/latest/notanumber`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(400);
		expect(res.body).toStrictEqual({
			error: 'Bad request',
		});
	});
});
