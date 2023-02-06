import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TicketsTable from '../components/TicketsTable';
import { fetchAllTickets } from '../services/tickets';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import usePagination from '../hooks/usePagination';
import TicketsPageHeader from '../components/TicketsPageHeader';

export default function Tickets() {
	const [tickets, setTickets] = useState();
	const [searchKeywords, setSearchKeywords] = useState('');
	const [ticketStatusFilter, setTicketStatusFilter] = useState('ALL');
	const { authToken } = useContext(AuthContext);

	const filterTickets = () => {
		const filteredByStatus = tickets?.filter(
			(ticket) =>
				ticket.status === ticketStatusFilter || ticketStatusFilter === 'ALL'
		);

		const filteredByKeywords = filteredByStatus?.filter((ticket) => {
			return (
				ticket.subject.toLowerCase().includes(searchKeywords.toLowerCase()) ||
				ticket.status.toLowerCase().includes(searchKeywords.toLowerCase())
			);
		});

		return filteredByKeywords;
	};

	const filteredTickets = filterTickets();

	const [paginatedTickets, PaginationButtons] = usePagination(
		filteredTickets,
		10
	);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const tickets = await fetchAllTickets(authToken);
				setTickets(tickets);
			} catch (e) {
				handleError(e);
			}
		};

		fetchTickets();
	}, []);

	return (
		<Layout>
			<div className="bg-white p-3 p-md-5 rounded-4 shadow-sm">
				<TicketsPageHeader
					searchValue={searchKeywords}
					setSearchValue={setSearchKeywords}
					selectValue={ticketStatusFilter}
					setSelectValue={setTicketStatusFilter}
				/>
				<TicketsTable tickets={paginatedTickets}></TicketsTable>
				<PaginationButtons />
			</div>
		</Layout>
	);
}
