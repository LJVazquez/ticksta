import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import ProjectUsersTable from './ProjectUsersTable';

jest.mock('../services/projects.js', () => ({
	updateProject: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const mockUsers = [
	{
		id: 1,
		name: 'John Doe',
		email: 'john@test.com',
		role: 'DEV',
	},
	{
		id: 2,
		name: 'Jane Doe',
		email: 'jane@test.com',
		role: 'USER',
	},
];
const removeMember = jest.fn();

const renderComponent = (role) => {
	const authUser = {
		name: role,
		userRole: role,
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<ProjectUsersTable
				users={mockUsers}
				removeMember={removeMember}
			></ProjectUsersTable>
		</AuthProviderMock>
	);
};

it('should display the users table', async () => {
	renderComponent('USER');

	for (let user of mockUsers) {
		const nameCell = await screen.findByRole('cell', { name: user.name });
		const emailCell = await screen.findByRole('cell', { name: user.email });

		expect(nameCell).toBeInTheDocument();
		expect(emailCell).toBeInTheDocument();
	}
});

it('should display the add member button if the user is an admin', async () => {
	renderComponent('ADMIN');

	const addMemberButton = await screen.findByRole('button', {
		name: /agregar usuario/i,
	});

	expect(addMemberButton).toBeInTheDocument();
});

it('should display the add member button if the user is a manager', async () => {
	renderComponent('MANAGER');

	const addMemberButton = await screen.findByRole('button', {
		name: /agregar usuario/i,
	});

	expect(addMemberButton).toBeInTheDocument();
});

it('should not display the add member button if the user is not an admin or manager', async () => {
	renderComponent('USER');

	const addMemberButton = screen.queryByRole('button', {
		name: /agregar usuario/i,
	});

	expect(addMemberButton).not.toBeInTheDocument();
});

it('should display the add member form when the add member button is clicked', async () => {
	renderComponent('ADMIN');

	const addMemberButton = await screen.findByRole('button', {
		name: /agregar usuario/i,
	});

	await user.click(addMemberButton);

	const assignMemberMsg = await screen.findByText(/asignar al equipo/i);

	expect(assignMemberMsg).toBeInTheDocument();
});

it('should display the remove member button in each row if the user is an admin', async () => {
	renderComponent('ADMIN');

	const removeMemberButtons = await screen.findAllByRole('button', {
		name: /remove member button/i,
	});

	expect(removeMemberButtons).toHaveLength(mockUsers.length);
});

it('should display the remove member button in each row if the user is a manager', async () => {
	renderComponent('MANAGER');

	const removeMemberButtons = await screen.findAllByRole('button', {
		name: /remove member button/i,
	});

	expect(removeMemberButtons).toHaveLength(mockUsers.length);
});

it('should not display the remove member button in each row if the user is not an admin or manager', async () => {
	renderComponent('USER');

	const removeMemberButtons = screen.queryAllByRole('button', {
		name: /remove member button/i,
	});

	expect(removeMemberButtons).toHaveLength(0);
});
