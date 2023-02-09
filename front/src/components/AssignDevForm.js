import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { assignTicketDev, updateTicketStatus } from '../services/tickets';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProjectDevs } from '../services/projects';

const smallAnimationSettings = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export default function ChangeTicketStatusForm({ ticket, setTicket }) {
	const [selectedDevEmail, setSelectedDevEmail] = useState('');
	const [projectDevs, setProjectDevs] = useState();
	const { authToken } = useContext(AuthContext);
	const [devChanged, setDevChanged] = useState(false);
	const [error, setError] = useState(null);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const _fetchProjectDevs = async () => {
			try {
				const devs = await fetchProjectDevs(ticket.project.id, authToken);
				setProjectDevs(devs);
			} catch (e) {
				handleError(e);
			}
		};
		_fetchProjectDevs();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const selectedDev = projectDevs.find(
			(projectDev) => projectDev.email === selectedDevEmail
		);

		if (!selectedDev) {
			setError('No se encontró al usuario');
			setTimeout(() => setError(null), 2000);
			return;
		}

		try {
			const updatedTicket = await assignTicketDev(
				ticket.id,
				selectedDev.id,
				authToken
			);

			setTicket(updatedTicket);
			setSelectedDevEmail('');
			setDevChanged(true);
			setTimeout(() => setDevChanged(false), 4000);
		} catch (e) {
			console.error('e', e);
			handleError(e);
		}
	};

	return (
		<>
			<form className="input-group" onSubmit={(e) => handleSubmit(e)}>
				<div className="input-group">
					<input
						value={selectedDevEmail}
						onChange={(e) => setSelectedDevEmail(e.target.value)}
						type="text"
						className="form-control form-control-sm rounded-3 border-0 bg-light rounded-end"
						list="members"
						autoComplete="off"
					/>
					<button className="btn btn-sm btn-dark rounded-3 rounded-start">
						Asignar
					</button>
				</div>
				<datalist id="members">
					{projectDevs?.map((dev) => (
						<option key={dev.id + dev.name} value={dev.email}>
							{dev.name}
						</option>
					))}
				</datalist>
			</form>
			<AnimatePresence>
				{devChanged && (
					<motion.small className="text-success" {...smallAnimationSettings}>
						<i className="bi bi-check me-1"></i>Desarrollador asignado
					</motion.small>
				)}
				{error && (
					<motion.small className="text-danger" {...smallAnimationSettings}>
						<i className="bi bi-check me-1"></i>
						{error}
					</motion.small>
				)}
			</AnimatePresence>
		</>
	);
}
