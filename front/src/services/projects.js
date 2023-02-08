import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const projectsUri = `${serverUrl}/projects`;

export async function fetchAllProjects(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.get(projectsUri, config);
	return res.data;
}

export async function fetchProjectStats(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.get(`${projectsUri}/stats`, config);
	return res.data;
}

export async function fetchLatestProjects(ticketAmount, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${projectsUri}/latest/${ticketAmount}`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function fetchProjectById(ticketId, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${projectsUri}/${ticketId}/`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function createProject(subject, description, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { subject, description };

	const res = await axios.post(projectsUri, data, config);
	return res.data;
}
