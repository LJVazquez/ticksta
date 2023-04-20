import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { createUser } from '../services/users';
import { registerInputConstraints } from '../utils/constraints';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import ticketHero from '../img/ticket-hero.png';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

export default function RegisterForm({ setIsUserCreated }) {
	const [isLoading, setIsLoading] = useState(false);
	const [registerError, setRegisterError] = useState(null);

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
			setRegisterError(e.response.data.error);
			setIsLoading(false);
			handleError(e);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h1 className="text-center">
				<img src={ticketHero} height="50" />
				<br />
				¿Sos nuevo? Registrate!
			</h1>
			{registerError && (
				<div
					className="alert alert-danger d-flex align-items-center"
					role="alert"
				>
					{registerError}
				</div>
			)}

			<Input
				name={'Nombre'}
				error={errors.name}
				rhfData={register('name', registerInputConstraints['name'])}
			/>
			<Input
				name={'Email'}
				error={errors.email}
				rhfData={register('email', registerInputConstraints['email'])}
			/>
			<Input
				name={'Password'}
				type="password"
				error={errors.password}
				rhfData={register('password', registerInputConstraints['password'])}
			/>

			<SubmitButton name={'Registrar'} isLoading={isLoading} />
		</form>
	);
}
