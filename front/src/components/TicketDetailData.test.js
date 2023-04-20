import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import TicketDetailData from './TicketDetailData';

const mockTicket = {
	id: 1,
	subject: 'subject',
	description: 'description',
	priority: 'LOW',
	status: 'OPEN',
	type: 'BUG',
	assignedToId: 1,
	project: {
		id: 1,
		name: 'project',
	},
	author: {
		name: 'john doe',
	},
};
const setTicket = jest.fn();

const renderComponent = (userId, userRole) => {
	const authUser = {
		userId: userId,
		userRole: userRole,
	};
	render(
		<AuthProviderMock authUser={authUser}>
			<TicketDetailData ticket={mockTicket} setTicket={setTicket} />
		</AuthProviderMock>
	);
};

it('should display the ticket detail data', async () => {
	renderComponent();

	const subject = screen.getByText(/tema/i);
	const description = screen.getByText(/descripcion/i);
	const priority = screen.getByText(/prioridad/i);
	const type = screen.getByText(/tipo/i);
	const project = screen.getByText(/proyecto/i);

	expect(subject).toBeInTheDocument();
	expect(description).toBeInTheDocument();
	expect(priority).toBeInTheDocument();
	expect(type).toBeInTheDocument();
	expect(project).toBeInTheDocument();
});

it('should display the update status menu if the user is an admin', async () => {
	renderComponent(1, 'ADMIN');

	const updateStatus = screen.getByText(/Actualizar estado/i);

	expect(updateStatus).toBeInTheDocument();
});

it('should display the update status menu if the user is a manager', async () => {
	renderComponent(1, 'MANAGER');

	const updateStatus = screen.getByText(/Actualizar estado/i);

	expect(updateStatus).toBeInTheDocument();
});

it('should display the update status menu if the user is a dev and the ticket is assigned to him', async () => {
	renderComponent(1, 'DEV');

	const updateStatus = screen.getByText(/Actualizar estado/i);

	expect(updateStatus).toBeInTheDocument();
});

it('should not display the update status menu if the user is a dev and the ticket is not assigned to him', async () => {
	renderComponent(2, 'DEV');

	const updateStatus = screen.queryByText(/Actualizar estado/i);

	expect(updateStatus).not.toBeInTheDocument();
});

it('should not display the update status menu if the user is a common user', async () => {
	renderComponent(1, 'USER');

	const updateStatus = screen.queryByText(/Actualizar estado/i);

	expect(updateStatus).not.toBeInTheDocument();
});

it('should display the assign dev menu if the user is an admin', async () => {
	renderComponent(1, 'ADMIN');

	const assignDev = screen.getByText(/Asignar desarrollador/i);

	expect(assignDev).toBeInTheDocument();
});

it('should display the assign dev menu if the user is a manager', async () => {
	renderComponent(1, 'MANAGER');

	const assignDev = screen.getByText(/Asignar desarrollador/i);

	expect(assignDev).toBeInTheDocument();
});

it('should not display the assign dev menu if the user is a dev', async () => {
	renderComponent(1, 'DEV');

	const assignDev = screen.queryByText(/Asignar desarrollador/i);

	expect(assignDev).not.toBeInTheDocument();
});

it('should not display the assign dev menu if the user is a common user', async () => {
	renderComponent(1, 'USER');

	const assignDev = screen.queryByText(/Asignar desarrollador/i);

	expect(assignDev).not.toBeInTheDocument();
});
