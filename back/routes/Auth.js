const express = require('express');
const router = express.Router();

const { login, getLoggedUserData } = require('../controllers/Auth');
const { authorizeUser } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/user-data', authorizeUser, getLoggedUserData);

module.exports = router;
