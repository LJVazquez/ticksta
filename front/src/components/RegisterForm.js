import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import { createUser } from '../services/users';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const inputConstraints = {
	name: {
		required: 'Por favor ingrese un nombre',
		minLength: { value: 6, message: 'Minimo 6 caracteres' },
		maxLength: { value: 30, message: 'Minimo 30 caracteres' },
	},
	email: {
		required: 'Por favor ingrese un email',
		pattern: {
			value: emailRegex,
			message: 'Email invalido',
		},
	},
	password: {
		required: 'Por favor ingrese una contraseña',
		minLength: { value: 6, message: 'Minimo 6 caracteres' },
		maxLength: { value: 30, message: 'Minimo 30 caracteres' },
	},
};

export default function RegisterForm({ setIsUserCreated }) {
	const [isLoading, setIsLoading] = useState(false);
	const handleError = useHandleAxiosError();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm();

	const onSubmit = async (formData) => {
		setIsLoading(true);
		try {
			const newUser = await createUser(
				formData.name,
				formData.email,
				formData.password
			);

			if (newUser) {
				setIsUserCreated(true);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			handleError(e);
		}
	};

	return (
		<form className="card p-3" onSubmit={handleSubmit(onSubmit)}>
			<h1>Crear nuevo usuario</h1>
			<Input
				name={'Nombre'}
				error={errors.name}
				rhfData={register('name', inputConstraints['name'])}
			/>
			<Input
				name={'Email'}
				error={errors.email}
				rhfData={register('email', inputConstraints['email'])}
			/>
			<Input
				name={'Password'}
				type="password"
				error={errors.password}
				rhfData={register('password', inputConstraints['password'])}
			/>

			<SubmitButton name={'Crear'} isLoading={isLoading} />
			<Link to="/login" className="text-end mt-2 pe-auto text-decoration-none">
				¿Ya estas registrado? Ir al login.
			</Link>
		</form>
	);
}
