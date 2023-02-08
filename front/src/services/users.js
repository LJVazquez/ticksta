import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const usersUri = `${serverUrl}/users`;

export async function createUser(name, email, password) {
	const data = { name, email, password };

	const res = await axios.post(usersUri, data);
	return res.data;
}

export async function fetchAllUsers(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.get(usersUri, config);
	return res.data;
}

export async function fetchAssignableUsers(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const uri = `${usersUri}/assignable/`;
	const res = await axios.get(uri, config);
	return res.data;
}

export async function changeUserRole(userId, role, token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const data = { role };
	const uri = `${usersUri}/${userId}/`;

	const res = await axios.patch(uri, data, config);
	return res.data;
}
