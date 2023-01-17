const e = require('express');
const jwt = require('jsonwebtoken');

const authorizeUser = async (req, res, next) => {
	const authorizationHeader = req.headers['authorization'];
	const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;

	if (!token) {
		return res.status(401).json({ error: 'Invalid or missing token' });
	}

	try {
		const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);

		if (!decodedToken) {
			return res.status(403).json({ error: 'token incorrecto' });
		}

		req.authData = decodedToken;
		next();
	} catch (e) {
		console.error('e.message', e.message);
		res.status(500).json({ error: e.message });
	}
};

function authorizeRole(requiredRole) {
	const _authorizeRoleCallback = (req, res, next) => {
		const userRole = req.authData.userRole;

		if (userRole !== requiredRole) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		next();
	};

	return _authorizeRoleCallback;
}

module.exports = { authorizeUser, authorizeRole };
