import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function useHandleAxiosError() {
	const { setAuthToken, setAuthUser } = useContext(AuthContext);
	const navigate = useNavigate();

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

		if (error.response?.status === 404) {
			navigate('/404');
		}
	};

	return handleError;
}
