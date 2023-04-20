import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import { createTicket } from '../services/tickets';
import AuthProviderMock from '../utils/AuthProviderMock';
import NewTicketForm from './NewTicketForm';

jest.mock('../services/tickets.js', () => ({
	createTicket: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<NewTicketForm />
		</AuthProviderMock>
	);
};

it('should call createTicket when the form is submitted', async () => {
	renderComponent();

	const subjectInput = screen.getByRole('textbox', { name: /tema/i });
	const descriptionInput = screen.getByRole('textbox', {
		name: /descripcion/i,
	});
	const submitButton = screen.getByRole('button', { name: /crear/i });

	const subject = 'A new ticket';
	const description = 'A new ticket description';
	await user.type(subjectInput, subject);
	await user.type(descriptionInput, description);
	await user.click(submitButton);

	await waitFor(() => {
		expect(createTicket).toHaveBeenCalled();
	});
});

it('should display error messages when there is empty fields', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /crear/i });
	await user.click(submitButton);

	const subjectError = await screen.findByText(/Por favor ingrese un tema/i);
	const descriptionError = await screen.findByText(
		/Por favor escriba una descripcion/i
	);

	expect(subjectError).toBeInTheDocument();
	expect(descriptionError).toBeInTheDocument();
});

it('should not call createTicket when there is an empty field', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /crear/i });
	await user.click(submitButton);

	await screen.findByText(/Por favor ingrese un tema/i);

	await waitFor(() => {
		expect(createTicket).not.toHaveBeenCalled();
	});
});
