const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const saltRounds = 10;

const {
	validateUserCreationData,
	validateUserUpdateData,
} = require('../utils/schemaValidators.js');

const getUsers = async (req, res) => {
	try {
		let users = await prisma.user.findMany({});
		users.map((user) => removeUserPrivateData(user));

		res.json(users);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const createUser = async (req, res) => {
	const data = req.body;

	const validationErrors = validateUserCreationData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	const hashedPassword = await bcrypt.hash(data.password, saltRounds);
	data.password = hashedPassword;

	try {
		let newUser = await prisma.user.create({
			data: data,
		});

		newUser = removeUserPrivateData(newUser);
		res.json(newUser);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const updateUser = async (req, res) => {
	const data = req.body;
	const userId = parseInt(req.params.id);

	const validationErrors = validateUserUpdateData(data);

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	const hashedPassword = data.password
		? await bcrypt.hash(data.password, saltRounds)
		: null;

	if (hashedPassword) data.password = hashedPassword;

	try {
		let updatedUser = await prisma.user.update({
			where: { id: userId },
			data: data,
		});

		updatedUser = removeUserPrivateData(updatedUser);
		res.json(updatedUser);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const getUserById = async (req, res) => {
	const userId = parseInt(req.params.id);

	try {
		let user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			return res.status(400).json({ error: 'Usuario no encontrado' });
		}

		user = removeUserPrivateData(user);
		res.json(user);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const getUserByEmail = async (req, res) => {
	const userEmail = req.params.userEmail;
	try {
		let user = await prisma.user.findUnique({ where: { email: userEmail } });
		user = removeUserPrivateData(user);

		res.json(user);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e.meta.cause });
	}
};

const removeUserPrivateData = (userData) => {
	delete userData.password;
	delete userData.jwtRefresh;
	delete userData.jwtRefreshDate;
	delete userData.resetPasswordCode;

	return userData;
};

module.exports = {
	getUsers,
	getUserById,
	getUserByEmail,
	createUser,
	updateUser,
};
