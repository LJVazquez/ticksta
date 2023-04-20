import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import { fetchTicketById } from '../services/tickets';
import TicketDetail from './TicketDetail';

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

jest.mock('../services/tickets.js', () => ({
	fetchTicketById: jest.fn(),
}));

const renderComponent = (role, userId) => {
	const authUser = {
		userRole: role,
		userId: userId,
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<TicketDetail />
		</AuthProviderMock>
	);
};

const mockTicket = {
	authorId: 1,
	assignedToId: 2,
	status: 'OPEN',
	project: { id: 1 },
	author: { name: 'john doe' },
};

describe('ticket status is not CLOSED', () => {
	it('should display the new message form when the user is an admin', async () => {
		fetchTicketById.mockResolvedValueOnce(mockTicket);
		renderComponent('ADMIN', 1);

		const newMessageInput = await screen.findByRole('textbox', {
			name: /responder/i,
		});
		expect(newMessageInput).toBeInTheDocument();
	});

	it('should display the new message form when the user is a manager', async () => {
		fetchTicketById.mockResolvedValueOnce(mockTicket);
		renderComponent('MANAGER', 1);

		const newMessageInput = await screen.findByRole('textbox', {
			name: /responder/i,
		});
		expect(newMessageInput).toBeInTheDocument();
	});

	it('should display the new message form when the user is the ticket author', async () => {
		fetchTicketById.mockResolvedValueOnce(mockTicket);
		renderComponent('USER', 1);

		const newMessageInput = await screen.findByRole('textbox', {
			name: /responder/i,
		});
		expect(newMessageInput).toBeInTheDocument();
	});

	it('should display the new message form when the user is the ticket assignee', async () => {
		fetchTicketById.mockResolvedValueOnce(mockTicket);
		renderComponent('DEV', 2);

		const newMessageInput = await screen.findByRole('textbox', {
			name: /responder/i,
		});
		expect(newMessageInput).toBeInTheDocument();
	});

	it('should not display the new message form when the user is not the ticket author, assignee, admin or manager', async () => {
		fetchTicketById.mockResolvedValueOnce(mockTicket);
		renderComponent('USER', 3);

		const newMessageInput = screen.queryByRole('textbox', {
			name: /responder/i,
		});

		expect(newMessageInput).not.toBeInTheDocument();
	});
});

describe('ticket status is CLOSED', () => {
	it('should not display the new message form if the user is an admin', async () => {
		fetchTicketById.mockResolvedValueOnce({ ...mockTicket, status: 'CLOSED' });
		renderComponent('ADMIN', 1);

		const newMessageInput = screen.queryByRole('textbox', {
			name: /responder/i,
		});

		expect(newMessageInput).not.toBeInTheDocument();
	});

	it('should not display the new message form if the user is a manager', async () => {
		fetchTicketById.mockResolvedValueOnce({ ...mockTicket, status: 'CLOSED' });
		renderComponent('MANAGER', 1);

		const newMessageInput = screen.queryByRole('textbox', {
			name: /responder/i,
		});

		expect(newMessageInput).not.toBeInTheDocument();
	});

	it('should not display the new message form if the user is the ticket author', async () => {
		fetchTicketById.mockResolvedValueOnce({ ...mockTicket, status: 'CLOSED' });
		renderComponent('USER', 1);

		const newMessageInput = screen.queryByRole('textbox', {
			name: /responder/i,
		});
		expect(newMessageInput).not.toBeInTheDocument();
	});

	it('should not display the new message form if the user is the ticket assignee', async () => {
		fetchTicketById.mockResolvedValueOnce({ ...mockTicket, status: 'CLOSED' });
		renderComponent('DEV', 2);

		const newMessageInput = screen.queryByRole('textbox', {
			name: /responder/i,
		});
		expect(newMessageInput).not.toBeInTheDocument();
	});
});
