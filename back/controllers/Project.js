const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
	validateProjectCreationData,
	validateProjectUpdateData,
} = require('../utils/schemaValidators.js');

const getProjects = async (req, res) => {
	const { userId, userRole } = req.authData;

	try {
		let projects;

		if (userRole === 'ADMIN' || userRole === 'MANAGER') {
			projects = await prisma.ticket.findMany({});
		} else {
			projects = await prisma.user.findUnique({
				where: { id: userId },
				select: { assignedProjects: true },
			});
		}

		res.json(projects.assignedProjects);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
};

const createProject = async (req, res) => {
	const data = req.body;
	const authUserId = req.authData.userId;

	const validationErrors = validateProjectCreationData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const newProject = await prisma.project.create({
			data: { ...data, authorId: authUserId },
		});

		res.json(newProject);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
};

//* helper de getProjectById
const userHasReadPermission = (user, project) => {
	const userHasAllowedRole =
		user.userRole === 'ADMIN' || user.userRole === 'MANAGER';

	const userIsAssignedToProject = project.assignedUsers.some(
		(assignedUser) => assignedUser.id === user.userId
	);

	return userHasAllowedRole || userIsAssignedToProject;
};

const getProjectById = async (req, res) => {
	const projectId = parseInt(req.params.id);
	authUserData = req.authData;

	if (isNaN(projectId)) {
		return res.status(400).json({ error: 'Error en el id' });
	}

	try {
		const project = await prisma.project.findUnique({
			where: { id: projectId },
			include: { assignedUsers: true },
		});

		if (!project) {
			return res.status(404).json({ error: 'Proyecto no encontrado' });
		}

		if (!userHasReadPermission(authUserData, project)) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		res.json(project);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
};

const getLatestProjects = async (req, res) => {
	const projectsAmount = parseInt(req.params.amount);
	authUserData = req.authData;

	if (isNaN(projectsAmount)) {
		return res.status(400).json({ error: 'Bad request' });
	}

	try {
		const projects = await prisma.project.findMany({
			take: projectsAmount,
			orderBy: { createdAt: 'desc' },
		});

		res.json(projects);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
};

const updateProject = async (req, res) => {
	const projectId = parseInt(req.params.id);
	const data = req.body;

	const validationErrors = validateProjectUpdateData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const updatedProject = await prisma.project.update({
			where: { id: projectId },
			data: data,
		});

		res.json(updatedProject);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.message });
	}
};

module.exports = {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	getLatestProjects,
};
