import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import NewMessageForm from './NewMessageForm';
import { createTicketMessage } from '../services/ticketMessages';

const setTicketMessages = jest.fn();

jest.mock('../services/ticketMessages.js', () => ({
	createTicketMessage: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<NewMessageForm setTicketMessages={setTicketMessages} />
		</AuthProviderMock>
	);
};

it('should call createTicketMessage when the form is submitted', async () => {
	renderComponent();

	const newMessageInput = screen.getByRole('textbox', { name: 'Responder' });
	const submitButton = screen.getByRole('button', { name: 'Responder' });

	const message = 'A new message for the ticket';
	await user.type(newMessageInput, message);
	await user.click(submitButton);

	await waitFor(() => {
		expect(createTicketMessage).toHaveBeenCalled();
	});
});

it('should call setTicketMessages when the form is submitted', async () => {
	renderComponent();

	const newMessageInput = screen.getByRole('textbox', { name: 'Responder' });
	const submitButton = screen.getByRole('button', { name: 'Responder' });

	const message = 'A new message for the ticket';
	await user.type(newMessageInput, message);
	await user.click(submitButton);

	await waitFor(() => {
		expect(setTicketMessages).toHaveBeenCalled();
	});
});
