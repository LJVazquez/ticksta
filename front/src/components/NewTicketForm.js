import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTicket } from '../services/tickets';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import SubmitButton from '../components/SubmitButton';
import Input from '../components/Input';
import TextArea from '../components/TextArea';

const inputConstraints = {
	subject: {
		required: 'Por favor ingrese un tema',
		minLength: {
			value: 6,
			message: 'Por favor describa el tema, minimo 10 caracteres',
		},
		maxLength: {
			value: 30,
			message: 'Maximo 50 caracteres',
		},
	},
	description: {
		required: 'Por favor escriba una descripcion',
		minLength: {
			value: 10,
			message:
				'Por favor escriba una descripcion detallada, minimo 10 caracteres',
		},

		maxLength: {
			value: 50,
			message: 'Maximo 50 caracteres',
		},
	},
};

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
				{error && <div class="alert alert-danger">{error}</div>}
				<Input
					name={'Tema'}
					error={errors.subject}
					rhfData={register('subject', inputConstraints['subject'])}
				/>

				<TextArea
					name={'Descripcion'}
					error={errors.description}
					rhfData={register('description', inputConstraints['description'])}
				/>

				<SubmitButton name={'Crear'} isLoading={isNewTicketLoading} />
			</div>
		</form>
	);
}
