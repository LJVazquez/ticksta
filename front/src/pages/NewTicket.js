import React from 'react';
import Layout from '../components/Layout';
import NewTicketForm from '../components/NewTicketForm';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTicket } from '../services/tickets';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import SubmitButton from '../components/SubmitButton';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { newTicketConstraints } from '../utils/constraints';
import InputSelect from '../components/InputSelect';
import { ticketTypesEquivalent } from '../utils/formats';

export default function NewTicket() {
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
		//TODO por ahora no se necesita type
		delete formData.type;
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

	const ticketTypes = ['BUG', 'FEATURE_REQ', 'OTHER', 'ISSUE'];
	const typeOptions = ticketTypes.map((type) => ({
		label: ticketTypesEquivalent[type],
		value: type,
	}));

	return (
		<Layout>
			<form
				className="row bg-white p-3 rounded-4 mb-3 shadow-sm mx-1"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="card-body">
					<h3 className="card-title mb-3">
						<i className="bi bi-file-plus-fill text-success"></i> Crear nuevo
						ticket
					</h3>
					{error && <div className="alert alert-danger">{error}</div>}
					<Input
						name={'Tema'}
						error={errors.subject}
						rhfData={register('subject', newTicketConstraints['subject'])}
					/>
					<InputSelect
						name="Tipo"
						options={typeOptions}
						error={errors.type}
						rhfData={register('type', newTicketConstraints['type'])}
					/>
					<TextArea
						name={'Descripcion'}
						error={errors.description}
						rhfData={register(
							'description',
							newTicketConstraints['description']
						)}
					/>

					<SubmitButton name={'Crear'} isLoading={isNewTicketLoading} />
				</div>
			</form>
		</Layout>
	);
}
