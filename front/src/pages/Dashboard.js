import React, { useState } from 'react';
import Layout from '../components/Layout';
import TicketsTable from '../components/TicketsTable';
import { Link } from 'react-router-dom';

const mockTickets = [
	{
		id: 1,
		status: 'Esperano respuesta',
		subject: 'Error con Cors en prod',
		createdAt: '2020-09-23',
	},
	{
		id: 21,
		status: 'Esperano respuesta',
		subject: 'Error con Cors en prod',
		createdAt: '2020-09-23',
	},
	{
		id: 31,
		status: 'Esperano respuesta',
		subject: 'Error con Cors en prod',
		createdAt: '2020-09-23',
	},
	{
		id: 4,
		status: 'Esperano respuesta',
		subject: 'Error con Cors en prod',
		createdAt: '2020-09-23',
	},
];

export default function Dashboard() {
	const [latestTickets, setLatestTickets] = useState(mockTickets);
	return (
		<Layout>
			<Link to="/new-ticket" className="btn btn-info">
				Nuevo ticket
			</Link>
			<p>Total de tickets: {latestTickets.length}</p>
			<p>Tickets pendientes: 5 hardcodeado :)</p>
			<TicketsTable tickets={latestTickets} />
		</Layout>
	);
}
