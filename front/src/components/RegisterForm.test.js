import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import { createUser } from '../services/users';
import AuthProviderMock from '../utils/AuthProviderMock';
import RegisterForm from './RegisterForm';
jest.mock('../services/users.js', () => ({
	createUser: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const setIsUserCreated = jest.fn();

const renderComponent = () => {
	render(
		<AuthProviderMock>
			<RegisterForm setIsUserCreated={setIsUserCreated} />
		</AuthProviderMock>
	);
};

it('should display the register form', async () => {
	renderComponent();

	const nameInput = screen.getByRole('textbox', { name: /nombre/i });
	const emailInput = screen.getByRole('textbox', { name: /Email/i });
	const passwordInput = screen.getByText(/password/i);
	const registerButton = await screen.findByRole('button', {
		name: /registrar/i,
	});

	expect(nameInput).toBeInTheDocument();
	expect(emailInput).toBeInTheDocument();
	expect(passwordInput).toBeInTheDocument();
	expect(registerButton).toBeInTheDocument();
});

it('should call createUser when the form is submitted', async () => {
	renderComponent();

	const nameInput = screen.getByRole('textbox', { name: /nombre/i });
	const emailInput = screen.getByRole('textbox', { name: /Email/i });
	const passwordInput = screen.getByText(/password/i);
	const registerButton = await screen.findByRole('button', {
		name: /registrar/i,
	});

	const mockCredentials = {
		name: 'john doe',
		email: 'john@test.com',
		password: '123456',
	};

	user.type(nameInput, mockCredentials.name);
	user.type(emailInput, mockCredentials.email);
	user.type(passwordInput, mockCredentials.password);

	await user.click(registerButton);

	await waitFor(() => {
		expect(createUser).toHaveBeenCalled();
	});

	expect(createUser).toHaveBeenCalledWith(
		mockCredentials.name,
		mockCredentials.email,
		mockCredentials.password
	);
});

it('should display error messages when the form is submitted and there are errors', async () => {
	renderComponent();

	const registerButton = await screen.findByRole('button', {
		name: /registrar/i,
	});
	await user.click(registerButton);

	const nameError = await screen.findByText(/Por favor ingrese un nombre/i);
	const emailError = await screen.findByText(/Por favor ingrese un email/i);
	const passwordError = await screen.findByText(
		/Por favor ingrese una contraseña/i
	);

	expect(nameError).toBeInTheDocument();
	expect(emailError).toBeInTheDocument();
	expect(passwordError).toBeInTheDocument();
});

it('should not call createUser when the form is submitted and there are errors', async () => {
	renderComponent();

	const registerButton = await screen.findByRole('button', {
		name: /registrar/i,
	});
	await user.click(registerButton);

	await screen.findByText(/Por favor ingrese un nombre/i);

	expect(createUser).not.toHaveBeenCalled();
});
