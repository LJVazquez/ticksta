import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { updateTicketStatus } from '../services/tickets';
import { motion, AnimatePresence } from 'framer-motion';

const smallAnimationSettings = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export default function ChangeTicketStatusForm({ ticket, setTicket }) {
	const [ticketStatusSelect, setTicketStatusSelect] = useState('');
	const { authToken } = useContext(AuthContext);
	const [statusChanged, setStatusChanged] = useState(false);

	const handleError = useHandleAxiosError();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (ticketStatusSelect === '') return;

			const updatedTicket = await updateTicketStatus(
				ticket.id,
				ticketStatusSelect,
				authToken
			);

			setTicket(updatedTicket);
			setTicketStatusSelect('');
			setStatusChanged(true);
			setTimeout(() => setStatusChanged(false), 4000);
		} catch (e) {
			console.error('e', e);
			handleError(e);
		}
	};

	return (
		<>
			<form className="input-group" onSubmit={(e) => handleSubmit(e)}>
				<select
					className="form-select-sm border-0 bg-light rounded-3 rounded-end"
					value={ticketStatusSelect}
					onChange={(e) => setTicketStatusSelect(e.target.value)}
				>
					<option value="" disabled></option>
					{ticket.status !== 'OPEN' && <option value="OPEN">Abierto</option>}
					{ticket.status !== 'INPROG' && (
						<option value="INPROG">En progreso</option>
					)}
					{ticket.status !== 'PENDING' && (
						<option value="PENDING">Pendiente</option>
					)}
					{ticket.status !== 'RESOLVED' && (
						<option value="RESOLVED">Resuelto</option>
					)}
					{ticket.status !== 'CLOSED' && (
						<option value="CLOSED">Cerrado</option>
					)}
				</select>
				<button className="input-group-text-sm bg-dark-subtle rounded-end-3 text-white">
					Actualizar
				</button>
			</form>
			<AnimatePresence>
				{statusChanged && (
					<motion.small className="text-success" {...smallAnimationSettings}>
						<i className="bi bi-check me-1"></i>Estado actualizado
					</motion.small>
				)}
			</AnimatePresence>
		</>
	);
}
