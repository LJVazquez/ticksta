import React, { useEffect, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import {
	ticketPrioritiesEquivalent,
	ticketTypesEquivalent,
} from '../utils/formats';
import { AuthContext } from '../context/AuthContext';
import { createTicket } from '../services/tickets';
import { fetchProjectById } from '../services/projects';
import { newTicketConstraints } from '../utils/constraints';
import ErrorAlert from '../components/ErrorAlert';
import Input from '../components/Input';
import InputReadOnly from '../components/InputReadOnly';
import InputSelect from '../components/InputSelect';
import Layout from '../components/Layout';
import SubmitButton from '../components/SubmitButton';
import TextArea from '../components/TextArea';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

export default function NewTicket() {
	const [isNewTicketLoading, setIsNewTicketLoading] = useState(false);
	const [project, setProject] = useState();
	const [error, setError] = useState(null);
	const { authToken } = useContext(AuthContext);

	const { projectId } = useParams();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm();

	const navigate = useNavigate();
	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const project = await fetchProjectById(projectId, authToken);
				setProject(project);
			} catch (e) {
				if (e.response?.status) {
					navigate('/401');
				}

				handleError(e);
				setError(e.message);
			}
		};
		fetchProject();
	}, []);

	const onSubmit = async (formData) => {
		setIsNewTicketLoading(true);
		try {
			const newTicket = await createTicket(
				projectId,
				formData.subject,
				formData.description,
				formData.type,
				formData.priority,
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
	const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH'];
	const typeOptions = ticketTypes.map((type) => ({
		label: ticketTypesEquivalent[type],
		value: type,
	}));
	const priorityOptions = ticketPriorities.map((priority) => ({
		label: ticketPrioritiesEquivalent[priority],
		value: priority,
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
					{error && <ErrorAlert>{error}</ErrorAlert>}
					<div className="mb-3">
						<InputReadOnly value={project?.name} disabled={true}>
							Proyecto
						</InputReadOnly>
					</div>
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
					<InputSelect
						name="Prioridad"
						options={priorityOptions}
						error={errors.priority}
						rhfData={register('priority', newTicketConstraints['priority'])}
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
