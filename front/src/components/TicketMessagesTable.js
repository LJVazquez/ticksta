import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formats';

const getMessageRows = (messages) => {
	return messages?.length > 0 ? (
		messages.map((message) => {
			const createdAt = formatDate(message.createdAt, 'DD/MM/YYYY HH:mm');
			const messageSubstr = message.message.substring(0, 10);
			return (
				<tr key={message.id}>
					<td>{messageSubstr}</td>
					<td>{message.user.name}</td>
					<td>
						<Link
							to={`/ticket-detail/${message.ticket.id}`}
							className="text-decoration-none"
						>
							{message.ticket.subject}
						</Link>
					</td>
					<td>{createdAt}</td>
				</tr>
			);
		})
	) : (
		<tr>
			<td colSpan={4} className="text-center">
				No se encontraron mensajes
			</td>
		</tr>
	);
};

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

export default function TicketMessagesTable({ messages }) {
	return (
		<div className="table-responsive mb-3">
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">Mensaje</th>
						<th scope="col">Usuario</th>
						<th scope="col">Ticket</th>
						<th scope="col">Fecha</th>
					</tr>
				</thead>
				<tbody>{messages ? getMessageRows(messages) : getSkeleton()}</tbody>
			</table>
		</div>
	);
}
