import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import TicketsTable from './TicketsTable';

const mockTickets = [
	{
		id: 1,
		subject: 'Test ticket 1',
		status: 'OPEN',
		createdAt: '2021-08-01T00:00:00.000Z',
		author: {
			name: 'john doe',
		},
		assignedTo: {
			name: 'jane doe',
		},
	},
	{
		id: 2,
		subject: 'Test ticket 2',
		status: 'CLOSED',
		createdAt: '2021-08-01T00:00:00.000Z',
		author: {
			name: 'tony stark',
		},
		assignedTo: {
			name: 'peter parker',
		},
	},
];

const renderComponent = (mockTickets) => {
	const authUser = {
		userId: 'ADMIN',
		userRole: 'ADMIN',
	};
	render(
		<AuthProviderMock authUser={authUser}>
			<TicketsTable tickets={mockTickets} />
		</AuthProviderMock>
	);
};

it('should display the tickets', async () => {
	renderComponent(mockTickets);

	for (const ticket of mockTickets) {
		const subject = await screen.findByText(ticket.subject);
		const author = await screen.findByText(ticket.author.name);
		const assignedTo = await screen.findByText(ticket.assignedTo.name);

		expect(subject).toBeInTheDocument();
		expect(author).toBeInTheDocument();
		expect(assignedTo).toBeInTheDocument();
	}
});

it('should display a message when no tickets are found', async () => {
	renderComponent([]);

	const message = await screen.findByText(/No se encontraron tickets/i);

	expect(message).toBeInTheDocument();
});
