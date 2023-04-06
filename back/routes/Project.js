const express = require('express');
const router = express.Router();
const {
	getProjects,
	createProject,
	getProjectById,
	getLatestProjects,
	updateProject,
	addUserToProject,
	removeUserFromProject,
	getProjectDevs,
} = require('../controllers/Project');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.post('/', authorizeRole('MANAGER'), createProject);

router.get('/:id', getProjectById);
router.patch('/:id', authorizeRole(['MANAGER', 'ADMIN']), updateProject);

router.get(
	'/latest/:amount',
	authorizeRole(['MANAGER', 'ADMIN']),
	getLatestProjects
);

router.post(
	'/:id/add-member',
	authorizeRole(['MANAGER', 'ADMIN']),
	addUserToProject
);

router.get('/:id/devs', authorizeRole(['MANAGER', 'ADMIN']), getProjectDevs);

router.post(
	'/:id/remove-member',
	authorizeRole(['MANAGER', 'ADMIN']),
	removeUserFromProject
);

module.exports = router;
