import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import AssignDevForm from './AssignDevForm';
import { fetchProjectDevs } from '../services/projects';
import { assignTicketDev } from '../services/tickets';

const mockTicket = { project: { id: 1 } };
const setTicket = jest.fn();
const mockDevs = [
	{ id: 1, name: 'john', email: 'john@dev.com' },
	{ id: 2, name: 'jane', email: 'jane@dev.com' },
];

jest.mock('../services/projects.js', () => ({
	fetchProjectDevs: jest.fn(),
}));

jest.mock('../services/tickets.js', () => ({
	assignTicketDev: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = () => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<AssignDevForm ticket={mockTicket} setTicket={setTicket} />
		</AuthProviderMock>
	);
};

it('should render with a project devs datalist', async () => {
	fetchProjectDevs.mockResolvedValueOnce(mockDevs);
	renderComponent();

	for (let dev of mockDevs) {
		const devOption = await screen.findByTestId(dev.id + dev.name);
		expect(devOption).toBeInTheDocument();
	}
});

it('should display a success message when a dev is assigned', async () => {
	fetchProjectDevs.mockResolvedValueOnce(mockDevs);
	assignTicketDev.mockResolvedValueOnce(mockTicket);
	renderComponent();

	await screen.findByTestId(mockDevs[1].id + mockDevs[1].name);

	const assignDevInput = await screen.findByRole('combobox');
	const asignarButton = screen.getByRole('button', { name: /asignar/i });

	await user.type(assignDevInput, 'jane@dev.com');
	await user.click(asignarButton);

	const successMessage = await screen.findByText(/Desarrollador asignado/);

	expect(successMessage).toBeInTheDocument();
});

it('should display an error message when a dev is not assigned', async () => {
	fetchProjectDevs.mockResolvedValueOnce(mockDevs);
	renderComponent();

	await screen.findByTestId(mockDevs[1].id + mockDevs[1].name);

	const assignDevInput = await screen.findByRole('combobox');
	const asignarButton = screen.getByRole('button', { name: /asignar/i });

	await user.type(assignDevInput, 'notAdev');
	await user.click(asignarButton);

	const errorMessage = await screen.findByText(/No se encontró al usuario/i);

	expect(errorMessage).toBeInTheDocument();
});
