import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import TicketMessages from './TicketMessages';

const mockMessages = [
	{
		id: 1,
		message: 'a message',
		createdAt: '2021-09-01T00:00:00.000Z',
		user: {
			name: 'john doe',
		},
	},
	{
		id: 2,
		message: 'another message',
		createdAt: '2021-09-01T00:00:00.000Z',
		user: {
			name: 'jane doe',
		},
	},
];

const renderComponent = (mockMessages) => {
	const authUser = {
		userId: 'ADMIN',
		userRole: 'ADMIN',
	};
	render(
		<AuthProviderMock authUser={authUser}>
			<TicketMessages messages={mockMessages} />
		</AuthProviderMock>
	);
};

it('should display the ticket messages', async () => {
	renderComponent(mockMessages);

	const message1 = await screen.findByText(mockMessages[0].message);
	const message2 = await screen.findByText(mockMessages[1].message);

	expect(message1).toBeInTheDocument();
	expect(message2).toBeInTheDocument();
});

it('should display a message if no messages are found', async () => {
	renderComponent([]);

	const noMessages = screen.getByText(/Sin mensajes/i);

	expect(noMessages).toBeInTheDocument();
});
