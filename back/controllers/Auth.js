const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validateLoginData } = require('../utils/schemaValidators');

const login = async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const validationErrors = validateLoginData({ email, password });

	if (validationErrors) {
		return res.status(409).json({ error: validationErrors });
	}

	try {
		const user = await getUserByEmail(email);

		if (!user) {
			return res
				.status(401)
				.json({ error: 'Email y/o contraseña incorrecto/s' });
		}

		const passwordMatches = await bcrypt.compare(password, user.password);
		delete user.password;

		if (passwordMatches) {
			const tokenData = {
				userId: user.id,
				email: user.email,
				name: user.name,
				userRole: user.role,
			};
			const jwt = await createToken(tokenData);
			const jwtRefresh = await createRefreshToken(tokenData);

			storeRefreshToken(email, jwtRefresh);

			res.json({ jwt });
		} else {
			return res
				.status(401)
				.json({ error: 'Email y/o contraseña incorrecto/s' });
		}
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const getLoggedUserData = (req, res) => {
	const authData = req.authData;
	res.json(authData);
};

const getUserByEmail = async (email, password) => {
	try {
		return await prisma.user.findUnique({ where: { email: email } });
	} catch (e) {
		console.error(e.message);
		res.status(500).json({ error: e.message });
	}
};

const createToken = async (data) => {
	const token = await jwt.sign(data, process.env.TOKEN_SECRET, {
		expiresIn: '10h',
	});
	return token;
};

const createRefreshToken = async (data) => {
	const refreshToken = await jwt.sign(data, process.env.TOKEN_SECRET, {
		expiresIn: '1 days',
	});
	return refreshToken;
};

const storeRefreshToken = async (email, token) => {
	const dateNow = new Date();
	const isoDateNow = dateNow.toISOString();

	try {
		const updatedUser = await prisma.user.update({
			where: { email: email },
			data: { jwtRefresh: token, jwtRefreshDate: isoDateNow },
		});

		if (updatedUser) {
			return true;
		}
	} catch (e) {
		console.error(e.me);
	}
};

module.exports = { login, getLoggedUserData };
