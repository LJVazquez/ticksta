const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const login = async (req, res) => {
	const userEmail = req.body.email;
	const userPassword = req.body.password;

	try {
		const user = await getUserByEmail(userEmail);
		const passwordMatches = await bcrypt.compare(userPassword, user.password);

		if (passwordMatches) {
			const tokenData = {
				userId: user.id,
				email: user.email,
				userRole: user.role,
			};
			const jwt = await createToken(tokenData);
			const jwtRefresh = await createRefreshToken(tokenData);

			storeRefreshToken(userEmail, jwtRefresh);

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

//TODO
const resetPassword = async (req, res) => {
	const userEmail = req.body.email;

	try {
		const user = await getUserByEmail(userEmail);

		if (!user) {
			return res.status(400).json({ error: 'Email no encontrato' });
		}

		const resetPasswordCode = uuidv4();
		const storedPasswordResetCode = storeResetPasswordCode(
			userEmail,
			resetPasswordCode
		);

		if (storedPasswordResetCode) {
			res.send('to ok');
		}
	} catch (e) {
		console.error(e.me);
		return res.status(500).json({ error: e.message });
	}
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
		expiresIn: '1h',
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

const storeResetPasswordCode = async (email, code) => {
	try {
		const updatedUser = await prisma.user.update({
			where: { email: email },
			data: { resetPasswordCode: code },
		});

		if (updatedUser) {
			return true;
		}
	} catch (e) {
		console.error(e.message);
	}
};

module.exports = { login, resetPassword };
