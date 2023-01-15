import React, { useState } from 'react';
import Layout from '../components/Layout';
import TicketMessages from '../components/TicketMessages';
import { useParams } from 'react-router-dom';

const mockTicket = {
	id: 1,
	status: 'Cabra',
	subject: 'Problema con Tero en el servidor principal',
	createdAt: '2020-09-23',
	messages: [
		{
			createdAt: '20/10/22',
			body: 'Problema con Tero en el servidor principal',
			sentBy: 'Cliente',
		},
		{
			createdAt: '20/10/22',
			body: 'Estamos en el tema señor tero por favor espere',
			sentBy: 'Admin jebra',
		},
	],
};

export default function TicketDetail() {
	const [ticket, setTicket] = useState(mockTicket);
	const [ticketResponse, setTicketResponse] = useState('');
	const ticketId = useParams('id');

	console.log('ticketId', ticketId);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('ticketResponse', ticketResponse);
		setTicketResponse('');
	};

	return (
		<Layout>
			<div className="row mb-3">
				<div className="col-12 col-md">
					<p className="mb-1">Tema: {mockTicket.subject}</p>
					<p className="mb-1">Fecha creacion: {mockTicket.createdAt}</p>
					<p className="mb-1">
						Estado: <span className="badge text-bg-info">{ticket.status}</span>
					</p>
				</div>
				<div className="col-12 col-md text-end">
					<button className="btn btn-secondary">Cerrar Ticket</button>
				</div>
			</div>
			<TicketMessages messages={ticket.messages} />
			<form className="mb-3" onSubmit={(e) => handleSubmit(e)}>
				<p>Responder</p>
				<div className="form-floating mb-3">
					<textarea
						className="form-control"
						id="responseField"
						style={{ height: 100 }}
						value={ticketResponse}
						onChange={(e) => setTicketResponse(e.target.value)}
						required
					/>
					<label htmlFor="responseField">Descripcion</label>
				</div>
				<button className="btn btn-primary">Enviar</button>
			</form>
		</Layout>
	);
}
