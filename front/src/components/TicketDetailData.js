import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
	formatDate,
	ticketStatusBackgroundColors,
	ticketStatusEquivalent,
} from '../utils/formats';
import ChangeTicketStatusForm from './ChangeTicketStatusForm';

export default function TicketDetailData({ ticket, setTicket }) {
	const { authUser } = useContext(AuthContext);

	if (ticket) {
		const createdAt = ticket && formatDate(ticket.createdAt);
		const badgeColor =
			ticket && `bg-${ticketStatusBackgroundColors[ticket['status']]}`;

		return (
			<>
				<div className="row bg-white p-3 rounded-4 mb-3 shadow-sm mx-1">
					<div className="col-12 d-flex align-items-center mb-3">
						<label className="fw-bold d-flex me-2">
							<i className="bi bi-ticket-fill me-2"></i>#{ticket.id}
						</label>
						<input value={ticket.subject} className="form-control" readOnly />
					</div>
					<div className="col-12 col-md-6 d-flex align-items-center mb-3">
						<label className="fw-bold d-flex me-2">Creado</label>
						<input value="Marcos Laporte" className="form-control" readOnly />
					</div>
					<div className="col-12 col-md-6 d-flex align-items-center mb-3">
						<label className="fw-bold d-flex me-2">Asignado</label>
						<input value="Juan Laporte" className="form-control" readOnly />
					</div>
					<div className="col-6 d-flex align-items-center">
						<label className="fw-bold d-flex me-2">Prioridad</label>
						<input value="Baja" className="form-control" readOnly />
					</div>
					<div className="col-6 d-flex align-items-center">
						<label className="fw-bold d-flex me-2">Tipo</label>
						<input value="Bug" className="form-control" readOnly />
					</div>
				</div>
				<div className="row mb-3 bg-white p-3 rounded-4 shadow-sm mx-1">
					<div className="col-12">
						<label className="fw-bold d-flex mb-2">Descripcion</label>
						<textarea
							style={{ resize: 'none' }}
							className="form-control bg-light rounded-3 border-0"
							readOnly
							value={ticket.description}
							rows="4"
							cols="50"
						/>
					</div>
				</div>
			</>
		);

		// return (
		// 	<div className="card p-3 mb-3 rounded-3">
		// 		<div className="row">
		// 			<div className="col-12 col-md-8">
		// 				<div>
		// 					<small className="fw-bold">Tema:</small>
		// 					<p className="mb-1">{ticket.subject}</p>
		// 				</div>{' '}
		// 				<div>
		// 					<small className="fw-bold">Descripcion:</small>
		// 					<p className="mb-1">{ticket.description}</p>
		// 				</div>
		// 			</div>
		// 			<div className="col-12 col-md-4">
		// 				<div>
		// 					<small className="fw-bold d-block">Estado:</small>
		// 					<span className={`badge ${badgeColor}`}>
		// 						{ticketStatusEquivalent[ticket.status]}
		// 					</span>
		// 				</div>
		// 				<div>
		// 					<small className="fw-bold">Fecha creacion:</small>
		// 					<p className="mb-1">{createdAt}</p>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		{authUser.userRole === 'ADMIN' && (
		// 			<div className="row mt-3">
		// 				<div className="col-auto">
		// 					<p className="fw-bold mb-0">Actualizar estado</p>
		// 					<ChangeTicketStatusForm ticket={ticket} setTicket={setTicket} />
		// 				</div>
		// 			</div>
		// 		)}
		// 	</div>
		// );
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
