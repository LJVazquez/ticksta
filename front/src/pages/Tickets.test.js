import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { fetchAllTickets } from '../services/tickets';
import AuthProviderMock from '../utils/AuthProviderMock';
import Tickets from './Tickets';

jest.mock('../services/tickets.js', () => ({
	fetchAllTickets: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<Tickets />
		</AuthProviderMock>
	);
};

const mockTickets = [
	{
		id: 1,
		subject: 'No puedo acceder a la base de datos',
		description:
			'Al intentar acceder a la aplicacion de pl/sql me sale un mensaje de error que dice "Por favor contacte con el administrador"',
		createdAt: '2023-01-21T00:00:00.000Z',
		updatedAt: '2023-02-16T17:31:19.185Z',
		status: 'OPEN',
		authorId: 3,
		assignedToId: 2,
		projectId: 1,
		type: 'ISSUE',
		priority: 'LOW',
		author: {
			name: 'Test User',
		},
		assignedTo: {
			name: 'Test Dev',
		},
	},
	{
		id: 1,
		subject: 'Mis credenciales expiraron',
		description:
			'Al intentar acceder a mi email o a teams me sale un mensaje de credenciales expiradas, y no puedo comunicarme con nadie para actualizarlas. Dejo mi numero de contacto 15-1232-2321',
		createdAt: '2023-01-21T00:00:00.000Z',
		status: 'CLOSED',
		projectId: 1,
		type: 'ISSUE',
		priority: 'LOW',
		author: {
			name: 'Test User',
		},
		assignedTo: {
			name: 'Test Dev',
		},
	},
];

it('should display a list of tickets', async () => {
	fetchAllTickets.mockResolvedValueOnce(mockTickets);
	renderComponent();

	for (let mockTicket of mockTickets) {
		const subjectRegex = new RegExp(mockTicket.subject, 'i');
		const row = await screen.findByRole('row', { name: subjectRegex });

		expect(row).toBeInTheDocument();
	}
});

it('should display a message when there are no tickets', async () => {
	fetchAllTickets.mockResolvedValueOnce([]);
	renderComponent();

	const noTicketsMessage = await screen.findByText(
		/No se encontraron tickets/i
	);
	expect(noTicketsMessage).toBeInTheDocument();
});

it('should only display tickets that match the search keywords', async () => {
	fetchAllTickets.mockResolvedValueOnce(mockTickets);
	renderComponent();

	const searchInput = screen.getByRole('textbox');
	user.type(searchInput, 'No puedo acceder a la base de datos');

	const noPuedoAccederRow = await screen.findByRole('row', {
		name: /No puedo acceder a la base de datos/i,
	});

	const misCredencialesExpiraronRow = screen.queryByRole('row', {
		name: /Mis credenciales expiraron/i,
	});

	expect(noPuedoAccederRow).toBeInTheDocument();
	expect(misCredencialesExpiraronRow).not.toBeInTheDocument();
});

it('should only diplay tickets that match the selected status', async () => {
	fetchAllTickets.mockResolvedValueOnce(mockTickets);
	renderComponent();

	const statusSelect = screen.getByRole('combobox');
	user.selectOptions(statusSelect, 'CLOSED');

	const misCredencialesExpiraronRow = await screen.findByRole('row', {
		name: /Mis credenciales expiraron/i,
	});

	const noPuedoAccederRow = screen.queryByRole('row', {
		name: /No puedo acceder a la base de datos/i,
	});

	expect(misCredencialesExpiraronRow).toBeInTheDocument();
	expect(noPuedoAccederRow).not.toBeInTheDocument();
});
