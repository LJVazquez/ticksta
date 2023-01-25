import { Link } from 'react-router-dom';
import {
	formatDate,
	ticketStatusEquivalent,
	ticketStatusBackgroundColors,
} from '../utils/formats';

const getSkeleton = () => {
	let tableRows = [];

	for (let i = 0; i < 5; i++) {
		tableRows.push(
			<tr key={i} className="placeholder-glow">
				<td colSpan={4}>
					<span className="placeholder col-12"></span>
				</td>
			</tr>
		);
	}

	return tableRows;
};

const getTicketRows = (tickets) => {
	return tickets?.length > 0 ? (
		tickets.map((ticket) => {
			const createdAt = formatDate(ticket.createdAt);
			const badgeColor = `bg-${ticketStatusBackgroundColors[ticket['status']]}`;

			return (
				<tr key={ticket.id}>
					<th scope="row">{ticket.id}</th>
					<td>
						<Link
							to={`/ticket-detail/${ticket.id}`}
							className="text-decoration-none"
						>
							{ticket.subject}
						</Link>
					</td>
					<td>
						<span className={`badge ${badgeColor}`}>
							{ticketStatusEquivalent[ticket.status]}
						</span>
					</td>
					<td>{createdAt}</td>
				</tr>
			);
		})
	) : (
		<tr>
			<td colSpan={4} className="text-center">
				No se encontraron tickets
			</td>
		</tr>
	);
};

export default function TicketsTable({ tickets }) {
	return (
		<div className="table-responsive mb-3">
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Tema</th>
						<th scope="col">Status</th>
						<th scope="col">Fecha</th>
					</tr>
				</thead>
				<tbody>{tickets ? getTicketRows(tickets) : getSkeleton()}</tbody>
			</table>
		</div>
	);
}
