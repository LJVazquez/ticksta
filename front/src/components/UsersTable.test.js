import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import UsersTable from './UsersTable';
import { UserRoleEquivalent } from '../utils/formats';

const mockUsers = [
	{
		id: 1,
		name: 'John Doe',
		role: 'USER',
		email: 'john@test.com',
	},
	{
		id: 2,
		name: 'Jane Doe',
		role: 'MANAGER',
		email: 'jane@test.com',
	},
];

const setUsers = jest.fn();

const renderComponent = (users) => {
	const authUser = {
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<UsersTable users={users} setUsers={setUsers} />
		</AuthProviderMock>
	);
};

it('should display the users table', async () => {
	renderComponent(mockUsers);

	for (const user of mockUsers) {
		const nameRegex = new RegExp(user.name, 'i');
		const emailRegex = new RegExp(user.email, 'i');
		const roleRegex = new RegExp(UserRoleEquivalent[user.role], 'i');

		const nameCell = screen.getByRole('cell', { name: nameRegex });
		const emailCell = screen.getByRole('cell', { name: emailRegex });
		const roleCell = screen.getByRole('cell', { name: roleRegex });

		expect(nameCell).toBeInTheDocument();
		expect(emailCell).toBeInTheDocument();
		expect(roleCell).toBeInTheDocument();
	}
});

it('should display a message if no user is found', async () => {
	renderComponent([]);

	const noUsersMessage = screen.getByText(/No se encontraron usuarios/i);
	expect(noUsersMessage).toBeInTheDocument();
});
