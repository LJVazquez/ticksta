import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useHandleAxiosError() {
	const { setAuthToken, setAuthUser } = useContext(AuthContext);

	const removeAuthData = () => {
		setAuthToken(null);
		setAuthUser(null);

		localStorage.removeItem('authToken');
		sessionStorage.removeItem('authUser');
	};

	const handleError = (error) => {
		console.error(error);

		if (error.response) {
			console.error(error.response.data);
		}

		if (
			error.response?.data.error === 'jwt expired' ||
			error.response?.data.error === 'jwt malformed'
		) {
			removeAuthData();
			console.error('error:', error.response.data.error);
		}
	};

	return handleError;
}
