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
router.get('/:id', getProjectById);
router.get('/:id/devs', authorizeRole(['MANAGER', 'ADMIN']), getProjectDevs);
router.get(
	'/latest/:amount',
	authorizeRole(['MANAGER', 'ADMIN']),
	getLatestProjects
);
router.post('/', authorizeRole('MANAGER'), createProject);
router.patch('/:id', authorizeRole(['MANAGER', 'ADMIN']), updateProject);
router.post(
	'/:id/add-member',
	authorizeRole(['MANAGER', 'ADMIN']),
	addUserToProject
);
router.post(
	'/:id/remove-member',
	authorizeRole(['MANAGER', 'ADMIN']),
	removeUserFromProject
);

module.exports = router;
