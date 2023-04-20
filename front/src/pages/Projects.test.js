import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import Projects from './Projects';
import { fetchAllProjects } from '../services/projects';

jest.mock('../services/projects.js', () => ({
	fetchAllProjects: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<Projects />
		</AuthProviderMock>
	);
};

const mockProjects = [
	{
		id: 1,
		name: 'Reserva catastrofica',
		createdAt: '2022-10-20T00:00:00.000Z',
		_count: {
			tickets: 2,
			assignedUsers: 2,
		},
	},
	{
		id: 2,
		name: 'Migracion de base de datos',
		createdAt: '2022-10-20T00:00:00.000Z',
		_count: {
			tickets: 2,
			assignedUsers: 2,
		},
	},
];

it('should display a list of projects', async () => {
	fetchAllProjects.mockResolvedValueOnce(mockProjects);
	renderComponent();

	for (const project of mockProjects) {
		const nameRegex = new RegExp(project.name, 'i');
		const projectCell = await screen.findByRole('row', { name: nameRegex });

		expect(projectCell).toBeInTheDocument();
	}
});

it('should display a message when there are no projects', async () => {
	fetchAllProjects.mockResolvedValueOnce([]);
	renderComponent();

	const message = await screen.findByText(/no se encontraron proyectos/i);

	expect(message).toBeInTheDocument();
});

it('should only display the projects that match the search keywords', async () => {
	fetchAllProjects.mockResolvedValueOnce(mockProjects);
	renderComponent();

	const searchInput = await screen.findByPlaceholderText(/buscar/i);
	user.type(searchInput, mockProjects[0].name);

	const matchingProjectRegex = new RegExp(mockProjects[0].name, 'i');
	const nonMatchingProjectRegex = new RegExp(mockProjects[1].name, 'i');

	const matchingProjectCell = await screen.findByRole('row', {
		name: matchingProjectRegex,
	});
	const nonMatchingProjectCell = screen.queryByRole('row', {
		name: nonMatchingProjectRegex,
	});

	expect(matchingProjectCell).toBeInTheDocument();
	expect(nonMatchingProjectCell).not.toBeInTheDocument();
});
