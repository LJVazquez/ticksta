import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { createProject } from '../services/projects';
import { newProjectConstraints } from '../utils/constraints';
import ErrorAlert from '../components/ErrorAlert';
import Input from '../components/Input';
import Layout from '../components/Layout';
import SubmitButton from '../components/SubmitButton';
import TextArea from '../components/TextArea';
import useHandleAxiosError from '../hooks/useHandleAxiosError';

export default function NewProject() {
	const [isNewProjectLoading, setIsNewProjectLoading] = useState(false);
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
		setIsNewProjectLoading(true);
		try {
			const newProject = await createProject(
				formData.name,
				formData.description,
				authToken
			);
			const newProjectUri = `/projects/${newProject.id}`;

			setIsNewProjectLoading(false);
			navigate(newProjectUri);
		} catch (e) {
			handleError(e);
			setError(e.message);
			setIsNewProjectLoading(false);
		}
	};

	return (
		<Layout>
			<form
				className="row bg-white p-3 rounded-4 mb-3 shadow-sm mx-1"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="card-body">
					<h3 className="card-title mb-3">
						<i className="bi bi-kanban-fill text-danger"></i> Crear nuevo
						proyecto
					</h3>
					{error && <ErrorAlert>{error}</ErrorAlert>}
					<Input
						name={'Nombre'}
						error={errors.name}
						rhfData={register('name', newProjectConstraints['name'])}
					/>

					<TextArea
						name={'Descripcion'}
						error={errors.description}
						rhfData={register(
							'description',
							newProjectConstraints['description']
						)}
					/>

					<SubmitButton name={'Crear'} isLoading={isNewProjectLoading} />
				</div>
			</form>
		</Layout>
	);
}
