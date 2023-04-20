import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import AuthProviderMock from '../utils/AuthProviderMock';
import Input from './Input';

const renderComponent = (name, error = null) => {
	const authUser = {
		name: 'admin',
		userRole: 'ADMIN',
	};

	render(
		<AuthProviderMock authUser={authUser}>
			<Input name={name} rhfData={{}} error={error} />
		</AuthProviderMock>
	);
};

it('should display an input with the name passed as prop', async () => {
	renderComponent('Nombre');

	const input = screen.getByRole('textbox', { name: /nombre/i });
	expect(input).toBeInTheDocument();
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
	expect(errorMessage.textContent).toBe('');
});
