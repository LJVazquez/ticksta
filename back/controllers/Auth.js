const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const getUserByEmail = async (email) => {
	return await prisma.user.findUnique({ where: { email: email } });
};

const createToken = async (data) => {
	const token = await jwt.sign(data, process.env.TOKEN_SECRET, {
		expiresIn: '10h',
	});
	return token;
};

module.exports = { login, getLoggedUserData, getUserByEmail, createToken };
