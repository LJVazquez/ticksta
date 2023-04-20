import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { changeUserRole } from '../services/users';
import AuthProviderMock from '../utils/AuthProviderMock';
import UserRoleTd from './UserRoleTd';

const mockUser = {
	id: 1,
	name: 'John Doe',
	role: 'USER',
};

const setUsers = jest.fn();

jest.mock('../services/users.js', () => ({
	changeUserRole: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<UserRoleTd user={mockUser} setUsers={setUsers} />
		</AuthProviderMock>
	);
};

it('should display the role change button', async () => {
	renderComponent();

	const roleChangeButton = screen.getByRole('button', { name: /change role/i });
	expect(roleChangeButton).toBeInTheDocument();
});

it('should display the roles select and confirm button when the role change button is clicked', async () => {
	renderComponent();

	const roleChangeButton = screen.getByRole('button');
	await user.click(roleChangeButton);

	const rolesSelect = screen.getByRole('combobox');
	const confirmButton = screen.getByRole('button', {
		name: /confirm change role/i,
	});
	const adminOption = screen.getByRole('option', { name: /Admin/i });
	const managerOption = screen.getByRole('option', { name: /Manager/i });
	const userOption = screen.getByRole('option', { name: /Usuario/i });
	const developerOption = screen.getByRole('option', {
		name: /Desarrollador/i,
	});

	expect(rolesSelect).toBeInTheDocument();
	expect(adminOption).toBeInTheDocument();
	expect(managerOption).toBeInTheDocument();
	expect(userOption).toBeInTheDocument();
	expect(developerOption).toBeInTheDocument();
	expect(confirmButton).toBeInTheDocument();
});

it('should display the role change success mark when the role is changed', async () => {
	renderComponent();

	const roleChangeButton = screen.getByRole('button');
	await user.click(roleChangeButton);

	const rolesSelect = screen.getByRole('combobox');
	await user.selectOptions(rolesSelect, 'MANAGER');

	const confirmButton = screen.getByRole('button', {
		name: /confirm change role/i,
	});
	await user.click(confirmButton);

	const successMark = await screen.findByTestId(/role-change-success/i);
	expect(successMark).toBeInTheDocument();
});

//! no se pudo evitar el error de "act(...):"
it('should call the changeUserRole function when the role is changed', async () => {
	renderComponent();

	const roleChangeButton = screen.getByRole('button', { name: /change role/i });
	await user.click(roleChangeButton);

	const rolesSelect = screen.getByRole('combobox');
	await user.selectOptions(rolesSelect, 'MANAGER');

	const confirmButton = screen.getByRole('button', {
		name: /confirm change role/i,
	});
	await user.click(confirmButton);

	await screen.findByTestId(/role-change-success/i);

	expect(changeUserRole).toHaveBeenCalledWith(
		mockUser.id,
		'MANAGER',
		expect.anything()
	);
});

it('should display the retry message when the role change fails', async () => {
	const fakeError = new Error('error');
	changeUserRole.mockRejectedValueOnce(fakeError);

	renderComponent();

	const roleChangeButton = screen.getByRole('button', { name: /change role/i });
	await user.click(roleChangeButton);

	const rolesSelect = screen.getByRole('combobox');
	await user.selectOptions(rolesSelect, 'MANAGER');

	const confirmButton = screen.getByRole('button', {
		name: /confirm change role/i,
	});
	await user.click(confirmButton);

	const retryMessage = await screen.findByText(/Reintentar/i);
	expect(retryMessage).toBeInTheDocument();
});
