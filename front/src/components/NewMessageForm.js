import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { createTicketMessage } from '../services/ticketMessages';
import { newMessageConstraint } from '../utils/constraints';
import SubmitButton from '../components/SubmitButton';
import TextArea from '../components/TextArea';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

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
