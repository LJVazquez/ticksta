import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
	ticketPrioritiesEquivalent,
	ticketStatusBackgroundColors,
	ticketStatusEquivalent,
	ticketTypesEquivalent,
} from '../utils/formats';
import ChangeTicketStatusForm from './ChangeTicketStatusForm';
import AssignDevForm from './AssignDevForm';
import InputReadOnly from './InputReadOnly';
import TextAreaReadOnly from './TextAreaReadOnly';

export default function TicketDetailData({ ticket, setTicket }) {
	const { authUser } = useContext(AuthContext);

	const hasChangingStatusPermissions =
		authUser.userRole === 'MANAGER' ||
		authUser.userRole === 'ADMIN' ||
		(authUser.userRole === 'DEV' && ticket?.assignedToId === authUser.userId);

	if (ticket) {
		const badgeColor =
			ticket && `bg-${ticketStatusBackgroundColors[ticket['status']]}`;

		return (
			<>
				<div className="row bg-white p-3 rounded-4 mb-3 shadow-sm mx-1">
					<div className="col-12 d-flex align-items-center justify-content-between mb-2">
						<h3>
							<i className="bi bi-ticket-fill me-2 text-warning"></i>#
							{ticket.id}
						</h3>
						<span className={`badge ${badgeColor}`}>
							{ticketStatusEquivalent[ticket.status]}
						</span>
					</div>
					<div className="col-12 d-flex align-items-center mb-3">
						<label className="fw-bold d-flex me-2">Proyecto:</label>
						<Link
							to={`/projects/${ticket.project.id}`}
							className="text-decoration-none"
						>
							{ticket.project.name}
						</Link>
					</div>
					<div className="col-12 d-flex align-items-center mb-3">
						<InputReadOnly value={ticket.subject}>Tema</InputReadOnly>
					</div>
					<div className="col-12 col-md-6 d-flex align-items-center mb-3">
						<InputReadOnly value={ticket.author.name}>Creador</InputReadOnly>
					</div>
					<div className="col-12 col-md-6 d-flex align-items-center mb-3">
						<InputReadOnly value={ticket.assignedTo?.name || 'Sin asignar'}>
							Asignado
						</InputReadOnly>
					</div>
					<div className="col-6 d-flex align-items-center">
						<InputReadOnly value={ticketPrioritiesEquivalent[ticket.priority]}>
							Prioridad
						</InputReadOnly>
					</div>
					<div className="col-6 d-flex align-items-center">
						<InputReadOnly value={ticketTypesEquivalent[ticket.type]}>
							Tipo
						</InputReadOnly>
					</div>
					<div className="row mt-3">
						{hasChangingStatusPermissions && (
							<div className="col-auto mb-3">
								<p className="fw-bold mb-2">Actualizar estado</p>
								<ChangeTicketStatusForm ticket={ticket} setTicket={setTicket} />
							</div>
						)}
						{(authUser.userRole === 'ADMIN' ||
							authUser.userRole === 'MANAGER') && (
							<div className="col-auto">
								<p className="fw-bold mb-2">Asignar Desarrollador</p>
								<AssignDevForm ticket={ticket} setTicket={setTicket} />
							</div>
						)}
					</div>
				</div>

				<div className="row mb-3 bg-white p-3 rounded-4 shadow-sm mx-1">
					<div className="col-12">
						<TextAreaReadOnly value={ticket.description}>
							Descripcion
						</TextAreaReadOnly>
					</div>
				</div>
			</>
		);
	}

	return (
		<div className="card p-3 mb-3 rounded-3">
			<div className="row">
				<div className="col-12 col-md-6">
					<div className="placeholder-glow">
						<small className="fw-bold">Tema:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
					<div className="placeholder-glow">
						<small className="fw-bold">Fecha creacion:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
				</div>
				<div className="col-12 col-md-6">
					<div className="placeholder-glow">
						<small className="fw-bold">Estado:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
					<div className="placeholder-glow">
						<small className="fw-bold">Descripcion:</small>
						<p className="mb-1 placeholder col-12"></p>
					</div>
				</div>
			</div>
		</div>
	);
}
