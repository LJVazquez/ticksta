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

router.get('/', authorizeUser, authorizeRole(['MANAGER', 'ADMIN']), getUsers);
router.get(
	'/assignable',
	authorizeUser,
	authorizeRole(['MANAGER', 'ADMIN']),
	getAssignableUsers
);
router.get('/:id', authorizeUser, authorizeRole('ADMIN'), getUserById);
router.post('/', createUser);
router.patch('/:id', authorizeUser, authorizeRole('ADMIN'), updateUser);

module.exports = router;
