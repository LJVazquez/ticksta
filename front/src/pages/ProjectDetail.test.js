import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import ProjectDetail from './ProjectDetail';

const renderComponent = (role) => {
	const authUser = {
		userRole: role,
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<ProjectDetail />
		</AuthProviderMock>
	);
};

it('should display the new ticket link if the user is a common user', async () => {
	renderComponent('USER');

	const newTicketLink = screen.getByRole('link', { name: /nuevo ticket/i });

	expect(newTicketLink).toBeInTheDocument();
});

it('should not display the new ticket link if the user is not a common user', async () => {
	renderComponent('MANAGER');

	const newTicketLink = screen.queryByRole('link', { name: /nuevo ticket/i });

	expect(newTicketLink).not.toBeInTheDocument();
});
