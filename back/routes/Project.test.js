const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = require('../app');
const apiRoute = process.env.API_ROUTE;
const projectsRoute = `${apiRoute}/projects`;

const testData = require('./testData.json');

let adminToken;
let managerToken;
let devToken;
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

	const devRes = await request(app)
		.post(`${apiRoute}/auth/login`)
		.send(testData.devCredentials);

	devToken = devRes.body.jwt;
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
		it('should return status code 200 and an array of projects', async () => {
			const res = await request(app)
				.get(projectsRoute)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toBeInstanceOf(Array);

			expect(res.body[0]).toHaveProperty('name');
			expect(res.body[0]).toHaveProperty('description');
		});

		it('should return status code 401 if the user is not logged in', async () => {
			const res = await request(app).get(projectsRoute);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Invalid or missing token',
			});
		});
	});

	describe('POST', () => {
		it('should return status code 201 and the created project if the user is a manager', async () => {
			const res = await request(app)
				.post(projectsRoute)
				.set('Authorization', `Bearer ${managerToken}`)
				.send({
					name: 'Project 1',
					description: 'Project 1 description',
				});

			expect(res.statusCode).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body).toHaveProperty('name', 'Project 1');
			expect(res.body).toHaveProperty('description', 'Project 1 description');

			testProject = res.body;
		});

		it('should return status code 401 if the user is not logged in', async () => {
			const res = await request(app).post(projectsRoute);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Invalid or missing token',
			});
		});

		it('should return status code 403 if the user is not a manager', async () => {
			const res = await request(app)
				.post(projectsRoute)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Project 2',
					description: 'Project 2 description',
				});

			expect(res.statusCode).toBe(403);
			expect(res.body).toStrictEqual({
				error: 'Unauthorized',
			});
		});

		it('should return status code 400 if the request body is invalid', async () => {
			const res = await request(app)
				.post(projectsRoute)
				.set('Authorization', `Bearer ${managerToken}`)
				.send({
					name: 'Project 3',
				});

			expect(res.statusCode).toBe(409);
			expect(res.body).toHaveProperty('error');
		});
	});
});

describe('/:id', () => {
	describe('GET', () => {
		it('should return status code 200 and a project', async () => {
			const res = await request(app)
				.get(`${projectsRoute}/${testProject.id}`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('id', testProject.id);
			expect(res.body).toHaveProperty('name', testProject.name);
			expect(res.body).toHaveProperty('description', testProject.description);
		});

		it('should return status code 401 if the user is not logged in', async () => {
			const res = await request(app).get(`${projectsRoute}/${testProject.id}`);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Invalid or missing token',
			});
		});

		it('should return status code 404 if the project does not exist', async () => {
			const res = await request(app)
				.get(`${projectsRoute}/999`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.statusCode).toBe(404);
			expect(res.body).toStrictEqual({
				error: 'Proyecto no encontrado',
			});
		});

		it('should return status code 403 if the user is not authorized', async () => {
			const res = await request(app)
				.get(`${projectsRoute}/${testProject.id}`)
				.set('Authorization', `Bearer ${devToken}`);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Unauthorized',
			});
		});
	});

	describe('PATCH', () => {
		it('should return status code 200 and the updated project if the user is authorized', async () => {
			const res = await request(app)
				.patch(`${projectsRoute}/${testProject.id}`)
				.set('Authorization', `Bearer ${managerToken}`)
				.send({
					name: 'Project 1 updated',
					description: 'Project 1 description updated',
				});

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('id', testProject.id);
			expect(res.body).toHaveProperty('name', 'Project 1 updated');
			expect(res.body).toHaveProperty(
				'description',
				'Project 1 description updated'
			);

			testProject = res.body;
		});

		it('should return status code 401 if the user is not logged in', async () => {
			const res = await request(app).patch(
				`${projectsRoute}/${testProject.id}`
			);

			expect(res.statusCode).toBe(401);
			expect(res.body).toStrictEqual({
				error: 'Invalid or missing token',
			});
		});

		it('should return status code 403 if the user is not authorized', async () => {
			const res = await request(app)
				.patch(`${projectsRoute}/${testProject.id}`)
				.set('Authorization', `Bearer ${devToken}`);

			expect(res.statusCode).toBe(403);
			expect(res.body).toStrictEqual({
				error: 'Unauthorized',
			});
		});

		it('should return status code 404 if the project does not exist', async () => {
			const res = await request(app)
				.patch(`${projectsRoute}/999`)
				.set('Authorization', `Bearer ${managerToken}`)
				.send({
					name: 'Project 1 updated',
					description: 'Project 1 description updated',
				});

			expect(res.statusCode).toBe(404);
			expect(res.body).toStrictEqual({
				error: 'Proyecto no encontrado',
			});
		});

		it('should return status code 400 if the request body is invalid', async () => {
			const res = await request(app)
				.patch(`${projectsRoute}/${testProject.id}`)
				.set('Authorization', `Bearer ${managerToken}`)
				.send({
					foo: 'bad body',
				});

			expect(res.statusCode).toBe(409);
			expect(res.body).toHaveProperty('error');
		});
	});
});

describe('/latest/:amount', () => {
	it('should return status code 200 and the latest projects', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/latest/2`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveLength(2);
	});

	it('should return status code 401 if the user is not logged in', async () => {
		const res = await request(app).get(`${projectsRoute}/latest/2`);

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({
			error: 'Invalid or missing token',
		});
	});

	it('should return status code 403 if the user is not authorized', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/latest/2`)
			.set('Authorization', `Bearer ${devToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body).toStrictEqual({
			error: 'Unauthorized',
		});
	});

	it('should return status code 400 if the amount is not a number', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/latest/notanumber`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(400);
		expect(res.body).toStrictEqual({
			error: 'Bad request',
		});
	});

	it('should return status code 400 if the amount is less than 1', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/latest/0`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(res.statusCode).toBe(400);
		expect(res.body).toStrictEqual({
			error: 'Bad request',
		});
	});
});

describe('/:id/add-member', () => {
	it('should return status code 200 and the updated project if the user is authorized', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/add-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: testData.dev.email });

		expect(res.statusCode).toBe(200);
		expect(res.body.assignedUsers[0]).toHaveProperty('id', testData.dev.id);
		expect(res.body.assignedUsers[0]).toHaveProperty(
			'email',
			testData.dev.email
		);
	});

	it('should return status code 409 if the user is already assigned to the project', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/add-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: testData.dev.email });

		expect(res.statusCode).toBe(409);
		expect(res.body).toStrictEqual({
			error: 'Usuario ya asignado',
		});
	});

	it('should return status code 401 if the user is not logged in', async () => {
		const res = await request(app).post(
			`${projectsRoute}/${testProject.id}/add-member`
		);

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({
			error: 'Invalid or missing token',
		});
	});

	it('should return status code 403 if the user is not authorized', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/add-member`)
			.set('Authorization', `Bearer ${devToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body).toStrictEqual({
			error: 'Unauthorized',
		});
	});

	it('should return status code 404 if the project does not exist', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/999/add-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: testData.dev.email });

		expect(res.statusCode).toBe(404);
		expect(res.body).toStrictEqual({
			error: 'Proyecto o usuario no encontrado',
		});
	});

	it('should return status code 404 if the user does not exist', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/add-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: 'baduser@test.com' });

		expect(res.statusCode).toBe(404);
		expect(res.body).toStrictEqual({
			error: 'Proyecto o usuario no encontrado',
		});
	});
});

describe('/:id/devs', () => {
	it('should return status code 200 and the project devs', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/${testProject.id}/devs`)
			.set('Authorization', `Bearer ${managerToken}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveLength(1);
		expect(res.body[0]).toHaveProperty('id', testData.dev.id);
		expect(res.body[0]).toHaveProperty('email', testData.dev.email);
	});

	it('should return status code 401 if the user is not logged in', async () => {
		const res = await request(app).get(
			`${projectsRoute}/${testProject.id}/devs`
		);

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({
			error: 'Invalid or missing token',
		});
	});

	it('should return status code 403 if the user is not authorized', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/${testProject.id}/devs`)
			.set('Authorization', `Bearer ${devToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body).toStrictEqual({
			error: 'Unauthorized',
		});
	});

	it('should return status code 404 if the project does not exist', async () => {
		const res = await request(app)
			.get(`${projectsRoute}/999/devs`)
			.set('Authorization', `Bearer ${managerToken}`);

		expect(res.statusCode).toBe(404);
		expect(res.body).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});
});

describe('/:id/remove-member', () => {
	it('should return status code 200 and the updated project if the user is authorized', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/remove-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: testData.dev.email });

		expect(res.statusCode).toBe(200);
		expect(res.body.assignedUsers).toHaveLength(0);
	});

	it('should return status code 401 if the user is not logged in', async () => {
		const res = await request(app).post(
			`${projectsRoute}/${testProject.id}/remove-member`
		);

		expect(res.statusCode).toBe(401);
		expect(res.body).toStrictEqual({
			error: 'Invalid or missing token',
		});
	});

	it('should return status code 403 if the user is not authorized', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/remove-member`)
			.set('Authorization', `Bearer ${devToken}`);

		expect(res.statusCode).toBe(403);
		expect(res.body).toStrictEqual({
			error: 'Unauthorized',
		});
	});

	it('should return status code 404 if the project does not exist', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/999/remove-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: testData.dev.email });

		expect(res.statusCode).toBe(404);
		expect(res.body).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 409 if the user is not assigned to the project', async () => {
		const res = await request(app)
			.post(`${projectsRoute}/${testProject.id}/remove-member`)
			.set('Authorization', `Bearer ${managerToken}`)
			.send({ userEmail: testData.dev.email });

		expect(res.statusCode).toBe(409);
		expect(res.body).toStrictEqual({
			error: 'Usuario no se encuentra en el proyecto',
		});
	});
});
