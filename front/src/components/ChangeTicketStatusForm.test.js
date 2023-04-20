import '@testing-library/jest-dom';
import {
	screen,
	render,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import ChangeTicketStatusForm from './ChangeTicketStatusForm';
import { ticketStatusEquivalent } from '../utils/formats';
import { updateTicketStatus } from '../services/tickets';

const mockTicket = { status: 'OPEN' };
const setTicket = jest.fn();

jest.mock('../services/tickets.js', () => ({
	updateTicketStatus: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<ChangeTicketStatusForm ticket={mockTicket} setTicket={setTicket} />
		</AuthProviderMock>
	);
};

it('should render without the current ticket status in the select options', async () => {
	renderComponent();

	const convertedStatus = ticketStatusEquivalent[mockTicket.status];
	const ticketStatusRegex = new RegExp(convertedStatus, 'i');

	const selectOption = screen.queryByRole('option', {
		name: ticketStatusRegex,
	});

	expect(selectOption).not.toBeInTheDocument();
});

it('should display a success message when the status is changed', async () => {
	renderComponent();

	const newStatus = 'RESOLVED';
	const select = screen.getByRole('combobox');
	user.selectOptions(select, newStatus);

	const submitButton = screen.getByRole('button', { name: /actualizar/i });
	user.click(submitButton);

	const successMsgRegex = new RegExp(/estado actualizado/i);
	await screen.findByText(successMsgRegex);

	expect(screen.getByText(successMsgRegex)).toBeInTheDocument();
});

it('should call updateTicketStatus with the new status and the ticket id', async () => {
	renderComponent();

	const newStatus = 'RESOLVED';
	const select = screen.getByRole('combobox');
	user.selectOptions(select, newStatus);

	const submitButton = screen.getByRole('button', { name: /actualizar/i });
	user.click(submitButton);

	const successMsgRegex = new RegExp(/estado actualizado/i);
	await screen.findByText(successMsgRegex);
	await waitForElementToBeRemoved(() => screen.queryByText(successMsgRegex), {
		timeout: 5000,
	});

	expect(updateTicketStatus).toHaveBeenCalledWith(
		mockTicket.id,
		newStatus,
		expect.any(String)
	);
});

it('should not call updateTicketStatus if the select is empty', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /actualizar/i });
	user.click(submitButton);

	await waitFor(() => {
		expect(updateTicketStatus).not.toHaveBeenCalled();
	});
});
