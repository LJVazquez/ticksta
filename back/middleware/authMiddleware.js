const jwt = require('jsonwebtoken');

const authorizeUser = async (req, res, next) => {
	const authorizationHeader = req.headers['authorization'];
	const token = authorizationHeader ? authorizationHeader.split(' ')[1] : null;

	if (!token) {
		return res.status(401).json({ error: 'Invalid or missing token' });
	}

	try {
		const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);

		req.authData = decodedToken;
		next();
	} catch (e) {
		console.error('e.message', e.message);

		if (e.name === 'TokenExpiredError') {
			return res.status(401).json({ error: e.message });
		}

		res.status(500).json({ error: e.message });
	}
};

function authorizeRole(requiredRoles) {
	const _authorizeRole = (req, res, next) => {
		const userRole = req.authData.userRole;

		if (typeof requiredRoles === 'string' && userRole === requiredRoles) {
			return next();
		}

		if (requiredRoles instanceof Array && requiredRoles.includes(userRole)) {
			return next();
		}

		return res.status(403).json({ error: 'Unauthorized' });
	};

	return _authorizeRole;
}

module.exports = { authorizeUser, authorizeRole };
