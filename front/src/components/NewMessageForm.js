import { createTicketMessage } from '../services/ticketMessages';
import TextArea from '../components/TextArea';
import SubmitButton from '../components/SubmitButton';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

const newMessageConstraint = {
	required: 'Por favor escriba una respuesta',
	minLength: {
		value: 10,
		message:
			'Por favor escriba una descripcion detallada, minimo 10 caracteres',
	},
	maxLength: {
		value: 100,
		message: 'Maximo 100 caracteres',
	},
};

export default function NewMessageForm({ setTicketMessages }) {
	const [isNewMessageLoading, setIsNewMessageLoading] = useState(false);
	const { ticketId } = useParams();
	const { authToken } = useContext(AuthContext);
	const handleError = useHandleAxiosError();

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	const onSubmit = async (formData) => {
		setIsNewMessageLoading(true);

		try {
			const newTicketMessage = await createTicketMessage(
				ticketId,
				formData.newMessage,
				authToken
			);

			setTicketMessages((prevTicketMessages) => [
				newTicketMessage,
				...prevTicketMessages,
			]);

			reset();
			setIsNewMessageLoading(false);
		} catch (e) {
			console.error('e', e);
			handleError(e);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextArea
				name={'Responder'}
				error={errors.newMessage}
				rhfData={register('newMessage', newMessageConstraint)}
			/>

			<SubmitButton name={'Responder'} isLoading={isNewMessageLoading} />
		</form>
	);
}
