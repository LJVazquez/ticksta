import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TicketMessages from '../components/TicketMessages';
import { fetchTicketById } from '../services/tickets';
import { AuthContext } from '../context/AuthContext';

import useHandleAxiosError from '../hooks/useHandleAxiosError';
import TicketDetailData from '../components/TicketDetailData';
import NewMessageForm from '../components/NewMessageForm';
import usePagination from '../hooks/usePagination';

export default function TicketDetail() {
	const [ticket, setTicket] = useState();
	const [ticketMessages, setTicketMessages] = useState(null);

	const { ticketId } = useParams();
	const { authToken } = useContext(AuthContext);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchTicketData = async () => {
			try {
				const ticketData = await fetchTicketById(parseInt(ticketId), authToken);
				setTicket(ticketData);
				setTicketMessages(ticketData.ticketMessages);
			} catch (e) {
				handleError(e);
			}
		};
		fetchTicketData();
	}, []);

	const [paginatedMessages, PaginationButtons] = usePagination(
		ticketMessages,
		5
	);

	const getSkeleton = () => {};

	return (
		<Layout>
			<TicketDetailData ticket={ticket} setTicket={setTicket} />
			<TicketMessages messages={paginatedMessages} />
			<PaginationButtons />
			{ticket && ticket?.status !== 'CLOSED' && (
				<NewMessageForm setTicketMessages={setTicketMessages} />
			)}
		</Layout>
	);
}
