import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default AuthProviderMock = ({ children, authUser }) => {
	const authToken = 'token';
	const setAuthToken = jest.fn();
	const setAuthUser = jest.fn();

	return (
		<AuthContext.Provider
			value={{ authToken, setAuthToken, authUser, setAuthUser }}
		>
			<BrowserRouter>{children}</BrowserRouter>
		</AuthContext.Provider>
	);
};
