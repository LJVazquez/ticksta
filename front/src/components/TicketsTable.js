import { Link } from 'react-router-dom';
import {
	formatDate,
	ticketStatusEquivalent,
	ticketStatusBackgroundColors,
} from '../utils/formats';

import { motion, AnimatePresence } from 'framer-motion';

const trAnimationSettings = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.2 },
};

const linkAnimationSettings = {
	whileHover: {
		scale: 1.01,
	},
};

const getSkeleton = () => {
	let tableRows = [];

	for (let i = 0; i < 5; i++) {
		tableRows.push(
			<tr key={i} {...trAnimationSettings}>
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
				<motion.tr
					initial="false"
					key={ticket.id + ticket.subject}
					{...trAnimationSettings}
				>
					<th scope="row">{ticket.id}</th>
					<td>
						<Link
							to={`/ticket-detail/${ticket.id}`}
							className="text-decoration-none"
						>
							<motion.div {...linkAnimationSettings}>
								{ticket.subject}
							</motion.div>
						</Link>
					</td>

					<td>
						<span className={`badge ${badgeColor}`}>
							{ticketStatusEquivalent[ticket.status]}
						</span>
					</td>
					<td>{ticket.author.name}</td>
					<td>{ticket.assignedTo?.name || 'Sin asignar'}</td>
					<td>{createdAt}</td>
				</motion.tr>
			);
		})
	) : (
		<tr>
			<td colSpan={6} className="text-center">
				No se encontraron tickets
			</td>
		</tr>
	);
};

export default function TicketsTable({ tickets }) {
	return (
		<div className="table-responsive bg-light p-3 mb-3 mx-md-3 rounded-4">
			<table className="table table-light table-hover table-sm">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Tema</th>
						<th scope="col">Creado</th>
						<th scope="col">Asignado</th>
						<th scope="col">Status</th>
						<th scope="col">Fecha</th>
					</tr>
				</thead>
				<tbody>
					<AnimatePresence>
						{tickets ? getTicketRows(tickets) : getSkeleton()}
					</AnimatePresence>
				</tbody>
			</table>
		</div>
	);
}
