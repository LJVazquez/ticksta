import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AuthProviderMock from '../utils/AuthProviderMock';
import InputSelect from './InputSelect';

const mockOptions = [
	{ value: 'OPEN', label: 'Abierto' },
	{ value: 'RESOLVED', label: 'Resuelto' },
	{ value: 'CLOSED', label: 'Cerrado' },
];

const renderComponent = (name, error = null) => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<InputSelect
				name={name}
				options={mockOptions}
				rhfData={{}}
				error={error}
			/>
		</AuthProviderMock>
	);
};

it('should display an input with the name passed as prop', async () => {
	renderComponent('Nombre');

	const input = screen.getByRole('combobox', { name: /nombre/i });
	expect(input).toBeInTheDocument();
});

it('should render the options passed as prop', async () => {
	renderComponent('Nombre');

	const options = screen.getAllByRole('option');
	expect(options.length).toBe(mockOptions.length);

	for (let mockOption of mockOptions) {
		const option = screen.getByRole('option', { name: mockOption.label });
		expect(option).toBeInTheDocument();
	}
});

it('should display an error message when an error is passed as prop', async () => {
	const error = { message: 'Este campo es requerido' };
	renderComponent('Nombre', error);

	const errorMessage = screen.getByText(error.message);
	expect(errorMessage.textContent).toBe(error.message);
});

it('should not display an error message when no error is passed as prop', async () => {
	renderComponent('Nombre');

	const errorMessage = screen.queryByTestId('error-message');
	expect(errorMessage).toBeEmptyDOMElement();
});
