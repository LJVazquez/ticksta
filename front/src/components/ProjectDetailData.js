import { formatDate } from '../utils/formats';
import InputReadOnly from './InputReadOnly';
import TextAreaReadOnly from './TextAreaReadOnly';

export default function ProjectDetailData({ project }) {
	if (project) {
		return (
			<div className="row bg-white p-3 rounded-4 mb-3 shadow-sm mx-1">
				<div className="col-12 d-flex align-items-center justify-content-between mb-2">
					<h3>
						<i className="bi bi-kanban-fill text-danger me-2"></i>Proyecto #
						{project.id}
					</h3>
				</div>
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
