import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { fetchAllUsers } from '../services/users';
import AuthProviderMock from '../utils/AuthProviderMock';
import Users from './Users';

jest.mock('../services/users.js', () => ({
	fetchAllUsers: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<Users />
		</AuthProviderMock>
	);
};

const mockUsers = [
	{
		id: 10,
		name: 'John Doe',
		email: 'user@email.com',
		role: 'USER',
	},
	{
		id: 11,
		name: 'Jane Doe',
		email: 'admin@test.com',
		role: 'ADMIN',
	},
];

it('should display a list of users', async () => {
	fetchAllUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	for (let mockUser of mockUsers) {
		const nameRegex = new RegExp(mockUser.name, 'i');
		const emailRegex = new RegExp(mockUser.email, 'i');

		const nameCell = await screen.findByRole('cell', { name: nameRegex });
		const emailCell = await screen.findByRole('cell', { name: emailRegex });

		expect(nameCell).toBeInTheDocument();
		expect(emailCell).toBeInTheDocument();
	}
});

it('should display a message when there are no users', async () => {
	fetchAllUsers.mockResolvedValueOnce([]);
	renderComponent();

	const message = await screen.findByText(/no se encontraron usuarios/i);
	expect(message).toBeInTheDocument();
});

it('should only display users that match the search criteria', async () => {
	fetchAllUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	const searchInput = await screen.findByRole('textbox');
	user.type(searchInput, 'john doe');

	const userRole = await screen.findByText(/john doe/i);
	const adminRole = await screen.queryByText(/jane doe/i);

	expect(userRole).toBeInTheDocument();
	expect(adminRole).not.toBeInTheDocument();
});

it('should only display users that match the role filter', async () => {
	fetchAllUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	const select = await screen.findByRole('combobox');
	user.selectOptions(select, 'USER');

	const userRole = await screen.findByText(/john doe/i);
	const adminRole = screen.queryByText(/jane doe/i);

	expect(userRole).toBeInTheDocument();
	expect(adminRole).not.toBeInTheDocument();
});
