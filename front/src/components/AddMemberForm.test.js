import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import AddMemberForm from './AddMemberForm';
import { fetchAssignableUsers } from '../services/users';

const mockUsers = [
	{ id: 1, name: 'John', email: 'john@test.com' },
	{ id: 2, name: 'Jane', email: 'jane@email.com' },
];
const mockCurrentUsers = [{ id: 1, name: 'John', email: 'john@test.com' }];

const addMemberMock = jest.fn();
const onUserAssignmentMock = jest.fn();

jest.mock('../services/users', () => ({
	fetchAssignableUsers: jest.fn(),
}));

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<AddMemberForm
				currentUsers={mockCurrentUsers}
				addMember={addMemberMock}
				onUserAssignment={onUserAssignmentMock}
			/>
		</AuthProviderMock>
	);
};

it('should render with a datalist of assignable users', async () => {
	fetchAssignableUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	//* el componente sustrae los currentUsers de la lista de assignableUsers
	const datalistOption = await screen.findByTestId(
		mockUsers[1].id + mockUsers[1].name
	);

	expect(datalistOption).toBeInTheDocument();
});

it('should call addMember with the selected email on successful add', async () => {
	fetchAssignableUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	await screen.findByTestId(mockUsers[1].id + mockUsers[1].name);

	const textbox = screen.getByRole('combobox');
	const asignarButton = screen.getByRole('button', { name: /Asignar/i });

	user.type(textbox, mockUsers[1].email);

	await user.click(asignarButton);

	expect(addMemberMock).toHaveBeenCalledWith(mockUsers[1].email);
});

it('should call onUserAssignment on successful add', async () => {
	fetchAssignableUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	await screen.findByTestId(mockUsers[1].id + mockUsers[1].name);

	const textbox = screen.getByRole('combobox');
	const asignarButton = screen.getByRole('button', { name: /Asignar/i });

	user.type(textbox, mockUsers[1].email);

	await user.click(asignarButton);

	expect(onUserAssignmentMock).toHaveBeenCalled();
});

it('should display an error if the user is not assignable', async () => {
	fetchAssignableUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	await screen.findByTestId(mockUsers[1].id + mockUsers[1].name);

	const textbox = screen.getByRole('combobox');
	const asignarButton = screen.getByRole('button', { name: /Asignar/i });

	user.type(textbox, 'notAssignableUser');

	await user.click(asignarButton);

	const error = await screen.findByText(/No se encontró al usuario/i);

	expect(error).toBeInTheDocument();
});

it('should remove the user from the datalist after successful add', async () => {
	fetchAssignableUsers.mockResolvedValueOnce(mockUsers);
	renderComponent();

	await screen.findByTestId(mockUsers[1].id + mockUsers[1].name);

	const textbox = screen.getByRole('combobox');
	const asignarButton = screen.getByRole('button', { name: /Asignar/i });

	user.type(textbox, mockUsers[1].email);

	await user.click(asignarButton);

	const datalistOption = await screen.queryByTestId(
		mockUsers[1].id + mockUsers[1].name
	);

	expect(datalistOption).not.toBeInTheDocument();
});
