import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TicketsTable from '../components/TicketsTable';
import TicketMessagesTable from '../components/TicketMessagesTable';
import { fetchLatestTickets } from '../services/tickets';
import { fetchLatestTicketMessages } from '../services/ticketMessages';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import AmountCard from '../components/AmountCard';

export default function Dashboard() {
	const [latestTickets, setLatestTickets] = useState();
	const [latestMessages, setLatestMessages] = useState();
	const [ticketAmounts, setTicketAmounts] = useState();
	const { authToken } = useContext(AuthContext);
	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const tickets = await fetchLatestTickets(5, authToken);

				const openTicketsCount = tickets.filter(
					(ticket) => ticket.status === 'OPEN'
				).length;
				const closedTicketsCount = tickets.filter(
					(ticket) => ticket.status === 'CLOSED'
				).length;
				const pendingTicketsCount = tickets.filter(
					(ticket) => ticket.status === 'PENDING'
				).length;
				const inProgressTicketsCount = tickets.filter(
					(ticket) => ticket.status === 'INPROG'
				).length;
				const resolvedTicketsCount = tickets.filter(
					(ticket) => ticket.status === 'RESOLVED'
				).length;

				setTicketAmounts([
					{ name: 'OPEN', value: openTicketsCount },
					{ name: 'CLOSED', value: closedTicketsCount },
					{ name: 'INPROG', value: inProgressTicketsCount },
					{ name: 'PENDING', value: pendingTicketsCount },
					{ name: 'RESOLVED', value: resolvedTicketsCount },
					,
				]);

				setLatestTickets(tickets);
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
				{ticketAmounts &&
					ticketAmounts.map((ticketAmount) => (
						<AmountCard
							key={ticketAmount.name}
							name={ticketAmount.name}
							value={ticketAmount.value}
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
