import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TicketsTable from '../components/TicketsTable';
import TicketMessagesTable from '../components/TicketMessagesTable';
import { fetchLatestTickets, fetchTicketStats } from '../services/tickets';
import { fetchLatestTicketMessages } from '../services/ticketMessages';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import AmountCard from '../components/AmountCard';

export default function Dashboard() {
	const [latestTickets, setLatestTickets] = useState();
	const [latestMessages, setLatestMessages] = useState();
	const [ticketStatusesCount, setTicketStatusesCount] = useState();
	const { authToken } = useContext(AuthContext);
	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const tickets = await fetchLatestTickets(5, authToken);
				const ticketStats = await fetchTicketStats(authToken);

				setLatestTickets(tickets);
				setTicketStatusesCount(ticketStats);
			} catch (e) {
				handleError(e);
			}
		};

		fetchTickets();
	}, []);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const ticketMessages = await fetchLatestTicketMessages(5, authToken);
				setLatestMessages(ticketMessages);
			} catch (e) {
				handleError(e);
			}
		};

		fetchMessages();
	}, []);

	return (
		<Layout>
			<h4>Ticket status</h4>
			<div className="row">
				{ticketStatusesCount &&
					Object.keys(ticketStatusesCount).map((status) => (
						<AmountCard
							key={status}
							name={status}
							value={ticketStatusesCount[status]}
						/>
					))}
			</div>
			<h4>Ultimos tickets</h4>
			<TicketsTable tickets={latestTickets} />
			<h4>Ultimos mensajes</h4>
			<TicketMessagesTable messages={latestMessages} />
		</Layout>
	);
}
