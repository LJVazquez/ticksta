const express = require('express');
const router = express.Router();

const {
	login,
	resetPassword,
	getLoggedUserData,
} = require('../controllers/Auth');
const { authorizeUser } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/user-data', authorizeUser, getLoggedUserData);

module.exports = router;
