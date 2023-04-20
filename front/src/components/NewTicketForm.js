import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { createTicket } from '../services/tickets';
import { newTicketConstraints } from '../utils/constraints';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import TextArea from '../components/TextArea';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

export default function NewTicketForm() {
	const [isNewTicketLoading, setIsNewTicketLoading] = useState(false);
	const [error, setError] = useState(null);
	const { authToken } = useContext(AuthContext);

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm();

	const navigate = useNavigate();
	const handleError = useHandleAxiosError();

	const onSubmit = async (formData) => {
		setIsNewTicketLoading(true);
		try {
			const newTicket = await createTicket(
				formData.subject,
				formData.description,
				authToken
			);
			const newTicketUri = `/ticket-detail/${newTicket.id}`;

			setIsNewTicketLoading(false);
			navigate(newTicketUri);
		} catch (e) {
			handleError(e);
			setError(e.message);
			setIsNewTicketLoading(false);
		}
	};

	return (
		<form
			className="card text-white bg-dark-subtle"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="card-body">
				<h3 className="card-title">Crear nuevo ticket</h3>
				<hr />
				{error && <div className="alert alert-danger">{error}</div>}
				<Input
					name={'Tema'}
					error={errors.subject}
					rhfData={register('subject', newTicketConstraints['subject'])}
				/>

				<TextArea
					name={'Descripcion'}
					error={errors.description}
					rhfData={register('description', newTicketConstraints['description'])}
				/>

				<SubmitButton name={'Crear'} isLoading={isNewTicketLoading} />
			</div>
		</form>
	);
}
