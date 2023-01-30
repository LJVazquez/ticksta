import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const ticketMessagesUri = `${serverUrl}/ticketmessages/`;

export async function createTicketMessage(ticketId, message, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { message, ticketId };

	const res = await axios.post(ticketMessagesUri, data, config);
	return res.data;
}

export async function fetchLatestTicketMessages(ticketMessageAmount, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${ticketMessagesUri}/latest/${ticketMessageAmount}`;

	const res = await axios.get(uri, config);
	return res.data;
}
