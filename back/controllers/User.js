const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
	const hashedPassword = await bcrypt.hash(data.password, saltRounds);
	data.password = hashedPassword;

	try {
		let newUser = await prisma.user.create({
			data: data,
		});

		newUser = removeUserPrivateData(newUser);
		res.json(newUser);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const updateUser = async (req, res) => {
	const data = req.body;
	const userId = parseInt(req.params.id);

	try {
		let updatedUser = await prisma.user.update({
			where: { id: userId },
			data: data,
		});

		updatedUser = removeUserPrivateData(updatedUser);
		res.json(updatedUser);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const getUserById = async (req, res) => {
	const userId = parseInt(req.params.id);

	try {
		let user = await prisma.user.findUnique({ where: { id: userId } });
		user = removeUserPrivateData(user);
		res.json(user);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const getUserByEmail = async (req, res) => {
	const userEmail = req.params.userEmail;
	try {
		let user = await prisma.user.findUnique({ where: { email: userEmail } });
		user = removeUserPrivateData(user);

		res.json(user);
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
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
