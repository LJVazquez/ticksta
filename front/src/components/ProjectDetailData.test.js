import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { updateProject } from '../services/projects';
import AuthProviderMock from '../utils/AuthProviderMock';
import ProjectDetailData from './ProjectDetailData';

jest.mock('../services/projects.js', () => ({
	updateProject: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const mockProject = {
	id: 1,
	name: 'Project 1',
	description: 'Project 1 description',
	createdAt: '2021-08-01T00:00:00.000Z',
	updatedAt: '2021-08-01T00:00:00.000Z',
	author: {
		name: 'john doe',
	},
};

const setProject = jest.fn();

const renderComponent = (userRole) => {
	const authUser = {
		name: userRole,
		userRole: userRole,
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<ProjectDetailData project={mockProject} setProject={setProject} />
		</AuthProviderMock>
	);
};

it('should display the project data', async () => {
	renderComponent();

	const nameInput = screen.getByText(mockProject.name);
	const descriptionInput = screen.getByText(mockProject.description);
	const authorInput = screen.getByText(mockProject.author.name);

	expect(nameInput).toBeInTheDocument();
	expect(descriptionInput).toBeInTheDocument();
	expect(authorInput).toBeInTheDocument();
});

it('should display the edit button if the user is an admin', async () => {
	renderComponent('ADMIN');

	const editButton = screen.getByRole('button', { name: /editar/i });

	expect(editButton).toBeInTheDocument();
});

it('should display the edit button if the user is a manager', async () => {
	renderComponent('MANAGER');

	const editButton = screen.getByRole('button', { name: /editar/i });

	expect(editButton).toBeInTheDocument();
});

it('should not display the edit button if the user is not a manager or admin', async () => {
	renderComponent('DEVELOPER');

	const editButton = screen.queryByRole('button', { name: /editar/i });

	expect(editButton).not.toBeInTheDocument();
});

it('should display the edit form when the edit button is clicked', async () => {
	renderComponent('ADMIN');

	const editButton = screen.getByRole('button', { name: /editar/i });
	await user.click(editButton);

	const nameInput = screen.getByLabelText(/nombre/i);
	const descriptionInput = screen.getByLabelText(/descripcion/i);
	const submitButton = screen.getByRole('button', { name: /actualizar/i });

	expect(nameInput).toBeInTheDocument();
	expect(descriptionInput).toBeInTheDocument();
	expect(submitButton).toBeInTheDocument();
});

it('should not display the edit form if the edit button is clicked again', async () => {
	renderComponent('ADMIN');

	const editButton = screen.getByRole('button', { name: /editar/i });
	await user.click(editButton);
	await user.click(editButton);

	const nameInput = screen.queryByLabelText(/nombre/i);
	const descriptionInput = screen.queryByLabelText(/descripcion/i);
	const submitButton = screen.queryByRole('button', { name: /actualizar/i });

	expect(nameInput).not.toBeInTheDocument();
	expect(descriptionInput).not.toBeInTheDocument();
	expect(submitButton).not.toBeInTheDocument();
});

it('should display a sucess message when the form is submitted', async () => {
	renderComponent('ADMIN');

	const editButton = screen.getByRole('button', { name: /editar/i });
	await user.click(editButton);

	const nameInput = screen.getByLabelText(/nombre/i);
	const descriptionInput = screen.getByLabelText(/descripcion/i);

	await user.type(nameInput, 'New name');
	await user.type(descriptionInput, 'New description');

	const submitButton = screen.getByRole('button', { name: /actualizar/i });
	await user.click(submitButton);

	const successMessage = await screen.findByText(/proyecto actualizado/i);

	expect(successMessage).toBeInTheDocument();
});

it('should call updateProject when the form is submitted', async () => {
	renderComponent('ADMIN');

	const editButton = screen.getByRole('button', { name: /editar/i });
	await user.click(editButton);

	const nameInput = screen.getByLabelText(/nombre/i);
	const descriptionInput = screen.getByLabelText(/descripcion/i);
	const submitButton = screen.getByRole('button', { name: /actualizar/i });

	await user.type(nameInput, 'New name');
	await user.type(descriptionInput, 'New description');
	await user.click(submitButton);

	await screen.findByText(/proyecto actualizado/i);

	expect(updateProject).toHaveBeenCalled();
});

it('should display error messages when the inputs are empty', async () => {
	renderComponent('ADMIN');

	const editButton = screen.getByRole('button', { name: /editar/i });
	await user.click(editButton);

	const nameInput = screen.getByLabelText(/nombre/i);
	const descriptionInput = screen.getByLabelText(/descripcion/i);
	const submitButton = screen.getByRole('button', { name: /actualizar/i });

	await user.clear(nameInput);
	await user.clear(descriptionInput);
	await user.click(submitButton);

	const nameError = await screen.findByText(/Por favor ingrese un tema/i);
	const descriptionError = await screen.findByText(
		/Por favor escriba una descripcion/i
	);

	expect(nameError).toBeInTheDocument();
	expect(descriptionError).toBeInTheDocument();
});
