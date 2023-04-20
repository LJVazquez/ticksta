import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import TicketMessagesTable from './TicketMessagesTable';

const mockMessages = [
	{
		id: 1,
		message: 'a message',
		createdAt: '2021-09-01T00:00:00.000Z',
		user: {
			name: 'john doe',
		},
		ticket: { id: 1 },
	},
	{
		id: 2,
		message: 'another message',
		createdAt: '2021-09-01T00:00:00.000Z',
		user: {
			name: 'jane doe',
		},
		ticket: { id: 1 },
	},
];

const renderComponent = (mockMessages) => {
	const authUser = {
		userId: 'ADMIN',
		userRole: 'ADMIN',
	};
	render(
		<AuthProviderMock authUser={authUser}>
			<TicketMessagesTable messages={mockMessages} />
		</AuthProviderMock>
	);
};

it('should display the ticket messages', async () => {
	renderComponent(mockMessages);

	for (const message of mockMessages) {
		const messageElement = await screen.findByText(
			message.message.substring(0, 10)
		);
		const author = await screen.findByText(message.user.name);

		expect(messageElement).toBeInTheDocument();
		expect(author).toBeInTheDocument();
	}
});

it('should display a message when there are no messages', async () => {
	renderComponent([]);

	const message = await screen.findByText('No se encontraron mensajes');

	expect(message).toBeInTheDocument();
});
