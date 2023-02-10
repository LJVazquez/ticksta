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

export async function fetchLatestProjects(projectAmount, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${projectsUri}/latest/${projectAmount}`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function fetchProjectById(projectId, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${projectsUri}/${projectId}/`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function fetchProjectDevs(projectId, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${projectsUri}/${projectId}/devs`;

	const res = await axios.get(uri, config);
	return res.data;
}

export async function createProject(name, description, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { name, description };

	const res = await axios.post(projectsUri, data, config);
	return res.data;
}

export async function updateProject(projectId, name, description, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { name, description };

	const uri = `${projectsUri}/${projectId}`;

	const res = await axios.patch(uri, data, config);
	return res.data;
}

export async function addUserToProject(projectId, userEmail, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { userEmail };
	const uri = `${projectsUri}/${projectId}/add-member`;

	const res = await axios.post(uri, data, config);
	return res.data;
}

export async function removeUserFromProject(projectId, userEmail, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { userEmail };
	const uri = `${projectsUri}/${projectId}/remove-member`;

	const res = await axios.post(uri, data, config);
	return res.data;
}
