const httpMocks = require('node-mocks-http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
	getProjects,
	getProjectDevs,
	createProject,
	userHasReadPermission,
	getProjectById,
	getLatestProjects,
	updateProject,
	addUserToProject,
	removeUserFromProject,
} = require('./Project.js');
const {
	validateProjectCreationData,
	validateProjectUpdateData,
} = require('../utils/schemaValidators.js');

//mocks and spies

jest.mock('@prisma/client', () => {
	// This is the mock database client we'll use in our tests
	// prisma.project.findMany() will return the value we set below
	const prismaMock = {
		project: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			findUnique: jest.fn(),
		},
		user: {
			findUnique: jest.fn(),
			findUnique: jest.fn(),
		},
	};

	// Return  the mock client when we require @prisma/client
	// This is what our service file will actually get when it imports @prisma/client
	// and what we'll be able to assert against later

	return {
		PrismaClient: jest.fn(() => prismaMock),
	};
});

jest.mock('../utils/schemaValidators.js', () => {
	return {
		validateProjectCreationData: jest.fn(),
		validateProjectUpdateData: jest.fn(),
	};
});

//

const fakeAdminData = {
	userId: 0,
	userRole: 'ADMIN',
};

const fakeDevData = {
	userId: 1,
	userRole: 'DEV',
};

const fakeManagerData = {
	userId: 3,
	userRole: 'MANAGER',
};

const fakeUserData = {
	userId: 4,
	userRole: 'USER',
};

const fakeProject = {
	id: 1,
	name: 'Project 1',
	description: 'Project 1 description',
	authorId: 1,
	createdAt: 'a date',
	updatedAt: 'another date',
	assignedUsers: [fakeDevData],
};

let req, res;

beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	validateProjectCreationData.mockReturnValue(null);
});

describe('getProjects', () => {
	it('should return status code 200', async () => {
		req.authData = fakeAdminData;
		getProjects(req, res);

		expect(res.statusCode).toBe(200);
	});

	it('should return a list of projects', async () => {
		prisma.project.findMany.mockReturnValueOnce([fakeProject]);
		req.authData = fakeAdminData;

		await getProjects(req, res);

		expect(res._getJSONData()).toStrictEqual([fakeProject]);
	});

	it('should return all projects if user is ADMIN or MANAGER', async () => {
		req.authData = fakeAdminData;

		await getProjects(req, res);

		const managerAndAdminFindManyOptions = {
			include: {
				_count: {
					select: { tickets: true, assignedUsers: true },
				},
			},
		};

		expect(prisma.project.findMany).toBeCalledWith(
			managerAndAdminFindManyOptions
		);
	});

	it('should return only assigned projects if user is DEV or USER', async () => {
		req.authData = fakeDevData;

		await getProjects(req, res);

		const developerAndUserFindManyOptions = {
			where: { id: fakeDevData.userId },
			select: {
				assignedProjects: {
					include: {
						_count: {
							select: { tickets: true, assignedUsers: true },
						},
					},
				},
			},
		};

		expect(prisma.user.findUnique).toBeCalledWith(
			developerAndUserFindManyOptions
		);
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Fake error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		prisma.project.findMany.mockReturnValueOnce(rejectedPromise);

		req.authData = fakeAdminData;

		await getProjects(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('getProjectDevs', () => {
	it('should return status code 200 and an array of users', async () => {
		req.authData = fakeAdminData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(fakeProject);
		await getProjectDevs(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual([fakeDevData]);
	});

	it('should return status code 404 if project does not exist', async () => {
		req.authData = fakeAdminData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(null);
		await getProjectDevs(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.authData = fakeAdminData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(rejectedPromise);

		await getProjectDevs(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if id is not a number', async () => {
		req.authData = fakeAdminData;
		req.params = { id: 'not a number' };

		await getProjectDevs(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Error en el id',
		});
	});
});

describe('createProject', () => {
	it('should return status code 201 and the created project', async () => {
		const fakeProjectData = {
			name: 'Project 1',
			description: 'Project 1 description',
		};

		req.authData = fakeAdminData;
		req.body = fakeProjectData;

		prisma.project.create.mockReturnValueOnce(fakeProject);

		await createProject(req, res);

		expect(res.statusCode).toBe(201);
		expect(res._getJSONData()).toStrictEqual(fakeProject);
	});

	it('should return status code 409 and the error message if the creation data is invalid', async () => {
		const fakeProjectData = {
			name: 'Project 1',
			description: 'Project 1 description',
		};

		const fakeErrorsArr = ['Error 1', 'Error 2'];

		req.authData = fakeDevData;
		req.body = fakeProjectData;

		validateProjectCreationData.mockReturnValueOnce(fakeErrorsArr);

		await createProject(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({ error: fakeErrorsArr });
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const fakeProjectData = {
			name: 'Project 1',
			description: 'Project 1 description',
		};

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.authData = fakeAdminData;
		req.body = fakeProjectData;

		prisma.project.create.mockReturnValueOnce(rejectedPromise);

		await createProject(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});
});

describe('userHasReadPermission', () => {
	it('should return true if user is ADMIN', () => {
		const result = userHasReadPermission(fakeAdminData, fakeProject);

		expect(result).toBe(true);
	});

	it('should return true if user is MANAGER', () => {
		const result = userHasReadPermission(fakeManagerData, fakeProject);

		expect(result).toBe(true);
	});

	it('should return true if user is not ADMIN or MANAGER and project is assigned to him', () => {
		anotherFakeProject = {
			assignedUsers: [
				{ id: fakeDevData.userId },
				{ id: fakeManagerData.userId },
			],
		};

		const result = userHasReadPermission(fakeDevData, anotherFakeProject);

		expect(result).toBe(true);
	});

	it('should return false if user is not ADMIN or MANAGER and project is not assigned to him', () => {
		const result = userHasReadPermission(fakeDevData, fakeProject);

		expect(result).toBe(false);
	});
});

describe('getProjectById', () => {
	it('should return status code 200 and the project searched if user has permission (ADMIN)', async () => {
		req.authData = fakeAdminData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(fakeProject);

		await getProjectById(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(fakeProject);
	});

	it('should return status code 200 and the project searched if user has permission (DEV)', async () => {
		const anotherFakeProject = {
			...fakeProject,
			assignedUsers: [{ id: fakeDevData.userId }],
		};

		req.authData = fakeDevData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(anotherFakeProject);

		await getProjectById(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(anotherFakeProject);
	});

	it('should return status code 404 if project does not exist', async () => {
		req.authData = fakeAdminData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(null);

		await getProjectById(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.authData = fakeAdminData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(rejectedPromise);

		await getProjectById(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if id is not a number', async () => {
		req.authData = fakeAdminData;
		req.params = { id: 'not a number' };

		await getProjectById(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Error en el id',
		});
	});

	it('should return status code 401 if authUser does not have read permission', async () => {
		anotherFakeProject = { assignedUsers: [{ ...fakeDevData, id: 2 }] };

		req.authData = fakeUserData;
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(anotherFakeProject);

		await getProjectById(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Unauthorized',
		});
	});
});

describe('getLatestProjects', () => {
	it('should return status code 200 and the latest projects', async () => {
		req.authData = fakeAdminData;
		req.params.amount = 1;

		prisma.project.findMany.mockReturnValueOnce([fakeProject]);

		await getLatestProjects(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual([fakeProject]);
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.authData = fakeAdminData;
		req.params.amount = 1;

		prisma.project.findMany.mockReturnValueOnce(rejectedPromise);

		await getLatestProjects(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if amount is not a number', async () => {
		req.authData = fakeAdminData;
		req.params.amount = 'not a number';

		await getLatestProjects(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Bad request',
		});
	});

	it('should return status code 400 if amount is not a positive number', async () => {
		req.authData = fakeAdminData;
		req.params.amount = -1;

		await getLatestProjects(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Bad request',
		});
	});
});

describe('updateProject', () => {
	it('should return status code 200 and the updated project', async () => {
		const projectUpdateData = { name: 'Updated project' };

		req.params = { id: 1 };
		req.authData = fakeAdminData;
		req.body = projectUpdateData;

		validateProjectUpdateData.mockReturnValueOnce(null);
		prisma.project.update.mockReturnValueOnce(fakeProject);

		await updateProject(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(fakeProject);
	});

	it('should return status code 400 if project update data is not valid', async () => {
		const projectUpdateData = { name: 'Updated project' };

		req.params = { id: 1 };
		req.authData = fakeAdminData;
		req.body = projectUpdateData;

		const errorsArr = ['Error 1', 'Error 2'];
		validateProjectUpdateData.mockReturnValueOnce(errorsArr);

		await updateProject(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({
			error: errorsArr,
		});
	});

	it('should return status code 404 if project does not exist', async () => {
		const projectUpdateData = { name: 'Updated project' };

		req.params = { id: 1 };
		req.authData = fakeAdminData;
		req.body = projectUpdateData;

		const fakeError = new Error('Project not found');
		fakeError.code = 'P2025';

		validateProjectUpdateData.mockReturnValueOnce(null);

		prisma.project.update.mockImplementationOnce(() => {
			throw fakeError;
		});

		await updateProject(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const projectUpdateData = { name: 'Updated project' };

		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.params = { id: 1 };
		req.authData = fakeAdminData;
		req.body = projectUpdateData;

		validateProjectUpdateData.mockReturnValueOnce(null);
		prisma.project.update.mockReturnValueOnce(rejectedPromise);

		await updateProject(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if id is not a number', async () => {
		const projectUpdateData = { name: 'Updated project' };

		req.params = { id: 'not a number' };
		req.authData = fakeAdminData;
		req.body = projectUpdateData;

		await updateProject(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Error en el id',
		});
	});
});

describe('addUserToProject', () => {
	it('should return status code 200 and the updated project', async () => {
		req.params = { id: 1 };
		req.body = { userEmail: 'test@email.com' };
		req.authData = fakeAdminData;

		prisma.project.findUnique.mockReturnValueOnce(fakeProject);
		prisma.user.findUnique.mockReturnValueOnce(fakeDevData);
		prisma.project.update.mockReturnValueOnce(fakeProject);

		await addUserToProject(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(fakeProject);
	});

	it('should return status code 400 if project id is not a number', async () => {
		req.params = { id: 'not a number' };

		await addUserToProject(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Error en el id',
		});
	});

	it('should return status code 400 if user email is not valid', async () => {
		req.params = { id: 1 };

		prisma.user.findUnique.mockReturnValueOnce(null);

		await addUserToProject(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto o usuario no encontrado',
		});
	});

	it('should return status code 400 if user email is not valid', async () => {
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(null);

		await addUserToProject(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto o usuario no encontrado',
		});
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.params = { id: 1 };
		req.authData = fakeAdminData;

		prisma.project.findUnique.mockReturnValueOnce(rejectedPromise);

		await addUserToProject(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if user is already in the project', async () => {
		const anotherFakeProject = {
			assignedUsers: [{ email: 'test@email.com' }],
		};

		req.params = { id: 1 };
		req.body = { userEmail: 'test@email.com' };
		req.authData = fakeAdminData;

		prisma.project.findUnique.mockReturnValueOnce(anotherFakeProject);
		prisma.user.findUnique.mockReturnValueOnce(fakeDevData);

		await addUserToProject(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Usuario ya asignado',
		});
	});
});

describe('removeUserFromProject', () => {
	it('should return status code 200 and the updated project', async () => {
		const anotherFakeProject = {
			assignedUsers: [{ email: 'test@email.com' }],
		};

		req.params = { id: 1 };
		req.body = { userEmail: 'test@email.com' };
		req.authData = fakeAdminData;

		prisma.project.findUnique.mockReturnValueOnce(anotherFakeProject);
		prisma.user.findUnique.mockReturnValueOnce(fakeDevData);
		prisma.project.update.mockReturnValueOnce(fakeProject);

		await removeUserFromProject(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(fakeProject);
	});

	it('should return status code 400 if project id is not a number', async () => {
		req.params = { id: 'not a number' };

		await removeUserFromProject(req, res);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Error en el id',
		});
	});

	it('should return status code 400 if user email is not valid', async () => {
		req.params = { id: 1 };

		prisma.user.findUnique.mockReturnValueOnce(null);

		await removeUserFromProject(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 400 if user email is not valid', async () => {
		req.params = { id: 1 };

		prisma.project.findUnique.mockReturnValueOnce(null);

		await removeUserFromProject(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Proyecto no encontrado',
		});
	});

	it('should return status code 500 and the error message if an error occurs', async () => {
		const errorMsg = 'Some error';
		const fakeError = new Error(errorMsg);
		const rejectedPromise = Promise.reject(fakeError);

		req.params = { id: 1 };
		req.authData = fakeAdminData;

		prisma.project.findUnique.mockReturnValueOnce(rejectedPromise);

		await removeUserFromProject(req, res);

		expect(res.statusCode).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: errorMsg });
	});

	it('should return status code 400 if user is already in the project', async () => {
		const anotherFakeProject = {
			assignedUsers: [{ email: 'test@email.com' }],
		};

		req.params = { id: 1 };
		req.body = { userEmail: 'anotherTest@email.com' };
		req.authData = fakeAdminData;

		prisma.project.findUnique.mockReturnValueOnce(anotherFakeProject);
		prisma.user.findUnique.mockReturnValueOnce(fakeDevData);

		await removeUserFromProject(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toStrictEqual({
			error: 'Usuario no se encuentra en el proyecto',
		});
	});
});
