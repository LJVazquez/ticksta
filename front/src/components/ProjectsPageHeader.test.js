import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import ProjectsPageHeader from './ProjectsPageHeader';

jest.mock('../services/projects.js', () => ({
	updateProject: jest.fn(),
}));

const renderComponent = (userRole) => {
	const authUser = {
		name: userRole,
		userRole: userRole,
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<ProjectsPageHeader />
		</AuthProviderMock>
	);
};

it('should display the new project link if the user is a manager', async () => {
	renderComponent('MANAGER');

	const newProjectLink = screen.getByRole('link', { name: /nuevo proyecto/i });

	expect(newProjectLink).toBeInTheDocument();
});

it('should not display the new project link if the user is not a manager', async () => {
	renderComponent('ADMIN');

	const newProjectLink = screen.queryByRole('link', {
		name: /nuevo proyecto/i,
	});

	expect(newProjectLink).not.toBeInTheDocument();
});
