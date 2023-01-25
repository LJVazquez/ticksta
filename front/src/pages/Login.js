import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/auth';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const inputConstraints = {
	email: {
		required: 'Por favor ingrese su email',
		pattern: {
			value: emailRegex,
			message: 'Email invalido',
		},
	},
	password: {
		required: 'Por favor ingrese su contraseña',
	},
};

export default function Login() {
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [loginError, setLoginError] = useState(null);
	const { authUser, setAuthToken } = useContext(AuthContext);
	const handleError = useHandleAxiosError();
	const navigate = useNavigate();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm();

	useEffect(() => {
		if (authUser !== null) {
			authUser.userRole === 'ADMIN'
				? navigate('/dashboard')
				: navigate('/tickets');
		}
	}, [authUser]);

	const onSubmit = async (formData) => {
		setIsLoginLoading(true);

		try {
			const authToken = await login(formData.email, formData.password);

			setAuthToken(authToken.jwt);
			localStorage.setItem('authToken', JSON.stringify(authToken.jwt));

			setIsLoginLoading(false);
		} catch (e) {
			handleError(e);
			setAuthToken(null);
			setLoginError(e.response.data.error);
			setIsLoginLoading(false);
		}
	};

	return (
		<form className="card p-3" onSubmit={handleSubmit(onSubmit)}>
			<h1>Login</h1>
			{loginError && (
				<div
					className="alert alert-danger d-flex align-items-center"
					role="alert"
				>
					{loginError}
				</div>
			)}

			<Input
				name={'Email'}
				error={errors.email}
				rhfData={register('email', inputConstraints['email'])}
			/>
			<Input
				name={'Password'}
				error={errors.password}
				type="password"
				rhfData={register('password', inputConstraints['password'])}
			/>

			<SubmitButton name={'Login'} isLoading={isLoginLoading} />
			<Link
				to="/register"
				className="text-end mt-2 pe-auto text-decoration-none"
			>
				¿No tenes usuario? Registrate acá.
			</Link>
		</form>
	);
}
