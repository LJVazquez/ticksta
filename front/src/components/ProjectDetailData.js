import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { newProjectConstraints } from '../utils/constraints';
import { formatDate } from '../utils/formats';
import ErrorAlert from './ErrorAlert';
import MsgAlert from './MsgAlert';
import Input from './Input';
import InputReadOnly from './InputReadOnly';
import SubmitButton from './SubmitButton';
import TextArea from './TextArea';
import TextAreaReadOnly from './TextAreaReadOnly';
import { updateProject } from '../services/projects';

export default function ProjectDetailData({ project, setProject }) {
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState(null);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [isUpdateProjectLoading, setIsUpdateProjectLoading] = useState(false);
	const { authUser, authToken } = useContext(AuthContext);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	useEffect(() => {
		if (project) {
			const defaultValues = {
				name: project.name,
				description: project.description,
			};

			reset(defaultValues);
		}
	}, [project]);

	const handleError = useHandleAxiosError();

	const onSubmit = async (formData) => {
		setIsUpdateProjectLoading(true);
		try {
			const updatedProject = await updateProject(
				project.id,
				formData.name,
				formData.description,
				authToken
			);

			setProject(updatedProject);
			setIsUpdateProjectLoading(false);
			setUpdateSuccess(true);
			setEditMode(false);

			setTimeout(() => {
				setUpdateSuccess(false);
			}, 4000);
		} catch (e) {
			handleError(e);
			setError(e.message);
			setIsUpdateProjectLoading(false);
		}
	};

	const getDetailDataBody = () => {
		if (editMode) {
			return (
				<form onSubmit={handleSubmit(onSubmit)}>
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
					<SubmitButton
						name={'Actualizar'}
						isLoading={isUpdateProjectLoading}
					/>
				</form>
			);
		} else {
			return (
				<>
					<div className="col-12 d-flex align-items-center mb-3">
						<InputReadOnly value={project.name}>Nombre</InputReadOnly>
					</div>
					<div className="col-12 col-md-6 d-flex align-items-center mb-3">
						<InputReadOnly value={project.author.name}>Creador</InputReadOnly>
					</div>
					<div className="col-12 col-md-6 d-flex align-items-center mb-3">
						<InputReadOnly value={formatDate(project.createdAt)}>
							Fecha
						</InputReadOnly>
					</div>
					<div className="col-12">
						<TextAreaReadOnly value={project.description}>
							Descripcion
						</TextAreaReadOnly>
					</div>
				</>
			);
		}
	};

	if (project) {
		return (
			<div className="row bg-white p-3 rounded-4 mb-3 shadow-sm mx-1">
				<div className="col-12 d-flex align-items-center justify-content-between mb-2">
					<h3>
						<i className="bi bi-kanban-fill text-danger me-2"></i>Proyecto #
						{project.id}
					</h3>
					{(authUser.userRole === 'MANAGER' ||
						authUser.userRole === 'ADMIN') && (
						<button
							className="btn btn-sm btn-outline-danger"
							onClick={() => setEditMode((prevState) => !prevState)}
						>
							<i className="bi bi-pencil-square"></i> Editar
						</button>
					)}
				</div>
				{updateSuccess && (
					<div className="container">
						<MsgAlert color="success">Proyecto actualizado</MsgAlert>
					</div>
				)}
				{getDetailDataBody()}
			</div>
		);
	}

	return (
		<div className="card p-3 mb-3 rounded-3">
			<div className="row">
				<div className="col-12 col-md-6">
					<div className="placeholder-glow">
						<small className="fw-bold">Nombre:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
					<div className="placeholder-glow">
						<small className="fw-bold">Creador:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
				</div>
				<div className="col-12">
					<div className="placeholder-glow">
						<small className="fw-bold">Descripcion:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
				</div>
			</div>
		</div>
	);
}
