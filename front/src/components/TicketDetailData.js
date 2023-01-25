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
			<div className="card p-3 mb-3 rounded-3">
				<div className="row">
					<div className="col-12 col-md-6">
						<div>
							<small className="fw-bold">Tema:</small>
							<p className="mb-1">{ticket.subject}</p>
						</div>
						<div>
							<small className="fw-bold">Fecha creacion:</small>
							<p className="mb-1">{createdAt}</p>
						</div>
					</div>
					<div className="col-12 col-md-6">
						<div>
							<small className="fw-bold d-block">Estado:</small>
							<span className={`badge ${badgeColor}`}>
								{ticketStatusEquivalent[ticket.status]}
							</span>
						</div>
						<div>
							<small className="fw-bold">Descripcion:</small>
							<p className="mb-1">{ticket.description}</p>
						</div>
					</div>
				</div>
				{authUser.userRole === 'ADMIN' && (
					<div className="row mt-3">
						<div className="col-auto">
							<p className="fw-bold mb-0">Actualizar estado</p>
							<ChangeTicketStatusForm ticket={ticket} setTicket={setTicket} />
						</div>
					</div>
				)}
			</div>
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
