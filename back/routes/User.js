const express = require('express');
const router = express.Router();
const {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	getAssignableUsers,
} = require('../controllers/User');
const {
	authorizeUser,
	authorizeRole,
} = require('../middleware/authMiddleware');

router.get(
	'/assignable',
	authorizeUser,
	authorizeRole(['MANAGER', 'ADMIN']),
	getAssignableUsers
);

router.get('/', authorizeUser, authorizeRole(['MANAGER', 'ADMIN']), getUsers);
router.post('/', createUser);

router.get('/:id', authorizeUser, authorizeRole('ADMIN'), getUserById);
router.patch('/:id', authorizeUser, authorizeRole('ADMIN'), updateUser);

module.exports = router;
