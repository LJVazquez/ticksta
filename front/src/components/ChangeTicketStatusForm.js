import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { updateTicketStatus } from '../services/tickets';

export default function ChangeTicketStatusForm({ ticket, setTicket }) {
	const [ticketStatusSelect, setTicketStatusSelect] = useState(ticket?.status);
	const { authToken } = useContext(AuthContext);

	const handleError = useHandleAxiosError();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const updatedTicket = await updateTicketStatus(
				ticket.id,
				ticketStatusSelect,
				authToken
			);
			setTicket(updatedTicket);
		} catch (e) {
			console.error('e', e);
			handleError(e);
		}
	};

	return (
		<form className="input-group mb-3" onSubmit={(e) => handleSubmit(e)}>
			<select
				className="form-select-sm border border-dark-subtle"
				value={ticketStatusSelect}
				onChange={(e) => setTicketStatusSelect(e.target.value)}
			>
				<option value="OPEN">Abierto</option>
				<option value="INPROG">En progreso</option>
				<option value="PENDING">Pendiente</option>
				<option value="RESOLVED">Resuelto</option>
				<option value="CLOSED">Cerrado</option>
			</select>
			<button className="input-group-text-sm bg-dark-subtle rounded-end-2 text-white">
				Actualizar
			</button>
		</form>
	);
}
