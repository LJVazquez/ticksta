import axios from 'axios';

const authUri = `http://localhost:3001/auth/`;

export async function login(email, password) {
	const res = await axios.post(authUri + 'login', { email, password });
	return res.data;
}

export async function fetchLoggedUserData(token) {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	};

	const res = await axios.post(authUri + 'user-data', null, config);
	return res.data;
}
