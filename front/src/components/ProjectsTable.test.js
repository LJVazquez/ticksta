import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import ProjectsTable from './ProjectsTable';

jest.mock('../services/projects.js', () => ({
	updateProject: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const mockProjects = [
	{
		id: 1,
		name: 'Project 1',
		description: 'Project 1 description',
		createdAt: '2021-08-01T00:00:00.000Z',
		updatedAt: '2021-08-01T00:00:00.000Z',
		author: {
			name: 'john doe',
		},
		_count: {
			assignedUsers: 1,
		},
	},
	{
		id: 2,
		name: 'Project 2',
		description: 'Project 2 description',
		createdAt: '2021-08-01T00:00:00.000Z',
		updatedAt: '2021-08-01T00:00:00.000Z',

		author: {
			name: 'jane doe',
		},
		_count: {
			assignedUsers: 1,
		},
	},
];

const renderComponent = (projects) => {
	const authUser = {
		name: 'ADMIN',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<ProjectsTable projects={projects}></ProjectsTable>
		</AuthProviderMock>
	);
};

it('should display the projects', async () => {
	renderComponent(mockProjects);

	for (const project of mockProjects) {
		const nameInput = await screen.findByRole('cell', { name: project.name });
		expect(nameInput).toBeInTheDocument();
	}
});

it('should display a message if no projects are found', async () => {
	renderComponent([]);

	const message = await screen.findByText(/No se encontraron proyectos/i);
	expect(message).toBeInTheDocument();
});
