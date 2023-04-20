import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import NewTicket from './NewTicket';
import { createTicket } from '../services/tickets';
import { fetchProjectById } from '../services/projects';

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

jest.mock('../services/tickets.js', () => ({
	createTicket: jest.fn(),
}));

jest.mock('../services/projects.js', () => ({
	fetchProjectById: jest.fn(),
}));

const renderComponent = () => {
	const authUser = {
		userRole: 'MANAGER',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<NewTicket />
		</AuthProviderMock>
	);
};

it('should display the new ticket form', async () => {
	renderComponent();

	const subjectInput = screen.getByLabelText(/Tema/i);
	const typeInput = screen.getByLabelText(/Tipo/i);
	const priorityInput = screen.getByLabelText(/Prioridad/i);
	const descriptionInput = screen.getByLabelText(/Descripcion/i);
	const submitButton = screen.getByRole('button', { name: /Crear/i });

	expect(subjectInput).toBeInTheDocument();
	expect(typeInput).toBeInTheDocument();
	expect(priorityInput).toBeInTheDocument();
	expect(descriptionInput).toBeInTheDocument();
	expect(submitButton).toBeInTheDocument();
});

it('should display error messages if the form is submitted with invalid data', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /Crear/i });
	submitButton.click();

	const subjectError = await screen.findByText(/Por favor ingrese un tema/i);
	const descriptionError = screen.getByText(
		/por favor escriba una descripcion/i
	);

	expect(subjectError).toBeInTheDocument();
	expect(descriptionError).toBeInTheDocument();
});

it('should call the createTicket function when the data is right', async () => {
	renderComponent();

	const subjectInput = screen.getByLabelText(/Tema/i);
	const typeInput = screen.getByLabelText(/Tipo/i);
	const priorityInput = screen.getByLabelText(/Prioridad/i);
	const descriptionInput = screen.getByLabelText(/Descripcion/i);
	const submitButton = screen.getByRole('button', { name: /Crear/i });

	const subject = 'test subject for a test ticket';
	await user.type(subjectInput, subject);

	const description = 'test description for a test ticket';
	await user.type(descriptionInput, description);

	const type = 'BUG';
	await user.selectOptions(typeInput, type);

	const priority = 'HIGH';
	await user.selectOptions(priorityInput, priority);

	await user.click(submitButton);

	//recibe undefined porque no encuentra el id del proyecto en los parametros de la url
	await waitFor(() => {
		expect(createTicket).toHaveBeenCalledWith(
			undefined,
			subject,
			description,
			type,
			priority,
			expect.anything()
		);
	});
});

it('should display an error message if the createTicket function fails', async () => {
	const errorMessage = 'test error message';
	const fakeError = new Error(errorMessage);
	createTicket.mockRejectedValue(fakeError);

	renderComponent();

	const subjectInput = screen.getByLabelText(/Tema/i);
	const typeInput = screen.getByLabelText(/Tipo/i);
	const priorityInput = screen.getByLabelText(/Prioridad/i);
	const descriptionInput = screen.getByLabelText(/Descripcion/i);

	const subject = 'test subject for a test ticket';
	await user.type(subjectInput, subject);

	const description = 'test description for a test ticket';
	await user.type(descriptionInput, description);

	const type = 'BUG';
	await user.selectOptions(typeInput, type);

	const priority = 'HIGH';
	await user.selectOptions(priorityInput, priority);

	const submitButton = screen.getByRole('button', { name: /Crear/i });
	await user.click(submitButton);

	const error = await screen.findByText(errorMessage);
	expect(error).toBeInTheDocument();
});

it('should display an error message if fetchProjectById fails', async () => {
	const errorMessage = 'test error message';
	const fakeError = new Error(errorMessage);
	fetchProjectById.mockRejectedValue(fakeError);

	renderComponent();

	const error = await screen.findByText(errorMessage);
	expect(error).toBeInTheDocument();
});
