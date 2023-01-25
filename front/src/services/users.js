import axios from 'axios';

const usersUri = `http://localhost:3001/users`;

export async function createUser(name, email, password) {
	const data = { name, email, password };

	const res = await axios.post(usersUri, data);
	return res.data;
}
