import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import Header from './Header';

const renderComponent = (authUser = null) => {
	render(
		<AuthProviderMock authUser={authUser}>
			<Header />
		</AuthProviderMock>
	);
};

describe('When user is not logged in', () => {
	it('should show login button', () => {
		renderComponent();

		const loginButton = screen.getByRole('link', { name: /login/i });
		expect(loginButton).toBeInTheDocument();
	});
});

describe('When user is logged in', () => {
	const authUser = {
		name: 'John Doe',
		userRole: 'USER',
	};

	it('should show the user name and logout button', () => {
		renderComponent(authUser);

		const logoutButtons = screen.getAllByText(/logout/i);
		const usernames = screen.getAllByText(authUser.name);

		// Header renderiza dos veces ya para distintos breakpoints
		expect(logoutButtons).toHaveLength(2);
		expect(usernames).toHaveLength(2);
	});

	it('should display the projects and tickets links', () => {
		renderComponent(authUser);

		const ticketsLink = screen.getByRole('link', { name: /tickets/i });
		const projectsLink = screen.getByRole('link', { name: /proyectos/i });

		expect(ticketsLink).toBeInTheDocument();
		expect(projectsLink).toBeInTheDocument();
	});

	it('should not display the users button if the logged user is not an admin', () => {
		renderComponent(authUser);

		const usersButton = screen.queryByRole('link', { name: /usuarios/i });
		expect(usersButton).not.toBeInTheDocument();
	});

	it('should display the users button if the logged user is an admin', () => {
		authUser.userRole = 'ADMIN';
		renderComponent(authUser);

		const usersButton = screen.getByRole('link', { name: /usuarios/i });
		expect(usersButton).toBeInTheDocument();
	});
});
