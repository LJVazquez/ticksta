import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import NewProject from './NewProject';
import { createProject } from '../services/projects';

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

jest.mock('../services/projects.js', () => ({
	createProject: jest.fn(),
}));

const renderComponent = () => {
	const authUser = {
		userRole: 'MANAGER',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<NewProject />
		</AuthProviderMock>
	);
};

it('should display the new project form', async () => {
	renderComponent();

	const nameInput = screen.getByLabelText(/Nombre/i);
	const descriptionInput = screen.getByLabelText(/Descripcion/i);
	const submitButton = screen.getByRole('button', { name: /Crear/i });

	expect(nameInput).toBeInTheDocument();
	expect(descriptionInput).toBeInTheDocument();
	expect(submitButton).toBeInTheDocument();
});

it('should display an error message if the form is submitted with invalid data', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /Crear/i });
	submitButton.click();

	const nameError = await screen.findByText(/Por favor ingrese un tema/i);
	const descriptionError = screen.getByText(
		/por favor escriba una descripcion/i
	);

	expect(nameError).toBeInTheDocument();
	expect(descriptionError).toBeInTheDocument();
});

it('should call the createProject function when the data is right', async () => {
	renderComponent();

	const nameInput = screen.getByLabelText(/Nombre/i);
	const descriptionInput = screen.getByLabelText(/Descripcion/i);
	const submitButton = screen.getByRole('button', { name: /Crear/i });

	await user.type(nameInput, 'My new test project');
	await user.type(
		descriptionInput,
		'This is a new test project made for testing pourposes'
	);
	await user.click(submitButton);

	await waitFor(() => {
		expect(createProject).toHaveBeenCalled();
	});
});

it('should not call the createProject function if the data is wrong', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /Crear/i });
	submitButton.click();

	await waitFor(() => {
		expect(createProject).not.toHaveBeenCalled();
	});
});

it('should display an error message if the createProject function throws an error', async () => {
	const errorMsg = 'fake error';
	const fakeError = new Error(errorMsg);
	createProject.mockRejectedValueOnce(fakeError);

	renderComponent();

	const nameInput = screen.getByLabelText(/Nombre/i);
	const descriptionInput = screen.getByLabelText(/Descripcion/i);
	const submitButton = screen.getByRole('button', { name: /Crear/i });

	await user.type(nameInput, 'My new test project');
	await user.type(
		descriptionInput,
		'This is a new test project made for testing pourposes'
	);
	await user.click(submitButton);

	const errorMessage = await screen.findByText(errorMsg);

	expect(errorMessage).toBeInTheDocument();
});
