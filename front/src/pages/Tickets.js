import React, { useState } from 'react';
import Layout from '../components/Layout';
import TicketsTable from '../components/TicketsTable';
import { Link } from 'react-router-dom';

const mockTickets = [
	{
		id: 1,
		status: 'Cabra',
		subject: 'Problema con Tero en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 21,
		status: 'Esperano respuesta',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 31,
		status: 'Esperano respuesta',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 4,
		status: 'Esperano respuesta',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 45,
		status: 'Fabra',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 23,
		status: 'Esperano respuesta',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 32,
		status: 'Mabra',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
	{
		id: 3,
		status: 'Tiros',
		subject: 'Problema con CORS en el servidor principal',
		createdAt: '2020-09-23',
	},
];

export default function Tickets() {
	const [tickets, setTickets] = useState(mockTickets);
	const [searchKeywords, setSearchKeywords] = useState('');

	const filteredTickets = tickets.filter((ticket) => {
		return (
			ticket.subject.toLowerCase().includes(searchKeywords.toLowerCase()) ||
			ticket.status.toLowerCase().includes(searchKeywords.toLowerCase())
		);
	});

	return (
		<Layout>
			<div className="d-flex justify-content-between mb-3">
				<Link to="/new-ticket" className="btn btn-info">
					Nuevo ticket
				</Link>

				<div className="row g-3 align-items-center">
					<div className="col-auto">
						<label htmlFor="searchInput" className="col-form-label">
							Buscar
						</label>
					</div>
					<div className="col-auto">
						<input
							type="text"
							id="searchInput"
							className="form-control"
							value={searchKeywords}
							onChange={(e) => setSearchKeywords(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<TicketsTable tickets={filteredTickets}></TicketsTable>
		</Layout>
	);
}
