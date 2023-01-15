import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TicketsTable({ tickets }) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Tema</th>
					<th scope="col">Status</th>
					<th scope="col">Fecha</th>
				</tr>
			</thead>
			<tbody>
				{tickets.length > 0 &&
					tickets.map((ticket) => (
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
							<td>{ticket.status}</td>
							<td>{ticket.createdAt}</td>
						</tr>
					))}
			</tbody>
		</table>
	);
}
