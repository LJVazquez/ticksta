const express = require('express');
const router = express.Router();
const {
	getProjects,
	createProject,
	getProjectById,
	getLatestProjects,
	updateProject,
} = require('../controllers/Project');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.get(
	'/latest/:amount',
	authorizeRole(['MANAGER', 'ADMIN']),
	getLatestProjects
);
router.post('/', authorizeRole('MANAGER'), createProject);
router.patch('/:id', authorizeRole(['MANAGER', 'ADMIN']), updateProject);

module.exports = router;
