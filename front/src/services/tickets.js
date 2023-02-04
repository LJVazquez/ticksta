import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const ticketsUri = `${serverUrl}/tickets`;

export async function fetchAllTickets(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.get(ticketsUri, config);
	return res.data;
}

export async function fetchTicketsByUserId(userId, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.get(`${ticketsUri}/user/${userId}`, config);
	return res.data;
}

export async function fetchTicketStats(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.get(`${ticketsUri}/stats`, config);
	return res.data;
}

export async function fetchLatestTickets(ticketAmount, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${ticketsUri}/latest/${ticketAmount}`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function fetchTicketById(ticketId, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${ticketsUri}/${ticketId}/`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function createTicket(subject, description, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { subject, description };

	const res = await axios.post(ticketsUri, data, config);
	return res.data;
}

//TODO cambiar a endpoint que solo cambia estados
export async function updateTicketStatus(ticketId, status, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { status };
	const uri = `${ticketsUri}/${ticketId}/`;

	const res = await axios.patch(uri, data, config);
	return res.data;
}
