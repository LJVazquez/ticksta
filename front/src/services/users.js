import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const usersUri = `${serverUrl}/users`;

export async function createUser(name, email, password) {
	const data = { name, email, password };

	const res = await axios.post(usersUri, data);
	return res.data;
}
