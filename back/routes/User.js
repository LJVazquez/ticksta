const express = require('express');
const router = express.Router();
const {
	getUsers,
	getUserById,
	createUser,
	updateUser,
} = require('../controllers/User');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authorizeRole('ADMIN'), getUsers);
router.get('/:id', authorizeRole('ADMIN'), getUserById);
router.post('/', authorizeRole('ADMIN'), createUser);
router.patch('/:id', authorizeRole('ADMIN'), updateUser);

module.exports = router;
