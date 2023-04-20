import '@testing-library/jest-dom';
import { login } from '../services/auth';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import Login from './Login';

jest.mock('../services/auth', () => ({
	login: jest.fn(),
}));

jest.mock('../hooks/useHandleAxiosError', () => () => jest.fn());

const renderComponent = (authUser = null) => {
	render(
		<AuthProviderMock authUser={authUser}>
			<Login />
		</AuthProviderMock>
	);
};

it('should render the login form', () => {
	renderComponent();

	const emailInput = screen.getByRole('textbox', { name: /email/i });
	const passwordInput = screen.getByLabelText(/password/i);

	expect(emailInput).toBeInTheDocument();
	expect(passwordInput).toBeInTheDocument();
});

it('should call the login function when the form is submitted', async () => {
	const credentials = { email: 'fakeEmail@test.com', password: 'fakePassword' };

	renderComponent();
	login.mockResolvedValueOnce({ jwt: 'fakeToken' });

	const emailInput = screen.getByRole('textbox', { name: /email/i });
	const passwordInput = screen.getByLabelText(/password/i);
	const submitButton = screen.getByRole('button', { name: /login/i });

	await user.type(emailInput, credentials.email);
	await user.type(passwordInput, credentials.password);
	await user.click(submitButton);

	await waitFor(() => expect(login).toHaveBeenCalled());

	expect(login).toHaveBeenCalledWith(credentials.email, credentials.password);
});

it('should show an error if the inputs are empty', async () => {
	renderComponent();

	const submitButton = screen.getByRole('button', { name: /login/i });

	await user.click(submitButton);

	const emailError = await screen.findByText(/por favor ingrese su email/i);
	const passwordError = await screen.findByText(
		/por favor ingrese su contraseña/i
	);

	expect(emailError).toBeInTheDocument();
	expect(passwordError).toBeInTheDocument();
});

it('should show an error message when the email is invalid', async () => {
	renderComponent();

	const emailInput = screen.getByRole('textbox', { name: /email/i });
	const submitButton = screen.getByRole('button', { name: /login/i });

	await user.type(emailInput, 'invalidEmail');
	await user.click(submitButton);

	const errorMessage = await screen.findByText(/Email invalido/i);

	expect(errorMessage).toBeInTheDocument();
});

it('should display the test users buttons when the test account option is selected', async () => {
	renderComponent();

	const testAccountOption = screen.getByText(/cuenta de prueba!/i);

	await user.click(testAccountOption);

	const adminButton = screen.getByRole('button', { name: /admin/i });
	const managerButton = screen.getByRole('button', { name: /manager/i });
	const devButton = screen.getByRole('button', { name: /dev/i });
	const userButton = screen.getByRole('button', { name: /user/i });

	expect(adminButton).toBeInTheDocument();
	expect(managerButton).toBeInTheDocument();
	expect(devButton).toBeInTheDocument();
	expect(userButton).toBeInTheDocument();
});

it('should display the login inputs when the enter with your email option is selected', async () => {
	renderComponent();

	const testAccountOption = screen.getByText(/cuenta de prueba!/i);
	await user.click(testAccountOption);

	const enterWithYourEmailOption = screen.getByText(/Ingresa con tu email!/i);
	await user.click(enterWithYourEmailOption);

	const emailInput = screen.getByRole('textbox', { name: /email/i });
	const passwordInput = screen.getByLabelText(/password/i);

	expect(emailInput).toBeInTheDocument();
	expect(passwordInput).toBeInTheDocument();
});

it('should display an error message when the login fails', async () => {
	renderComponent();

	const emailInput = screen.getByRole('textbox', { name: /email/i });
	const passwordInput = screen.getByLabelText(/password/i);
	const submitButton = screen.getByRole('button', { name: /login/i });

	const credentials = { email: 'bad@email.com', password: 'badPassword' };
	const errorMessage = 'Email y/o contraseña incorrecto/s';

	login.mockRejectedValueOnce({ response: { data: { error: errorMessage } } });

	await user.type(emailInput, credentials.email);
	await user.type(passwordInput, credentials.password);
	await user.click(submitButton);

	const errorAlert = await screen.findByText(errorMessage);

	expect(errorAlert).toBeInTheDocument();
});
