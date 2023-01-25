import React, { useContext, useEffect, useState } from 'react';
import { fetchLoggedUserData } from '../services/auth';

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
	let storedToken = JSON.parse(localStorage.getItem('authToken'));
	let storedUser = JSON.parse(sessionStorage.getItem('authUser'));

	const [authToken, setAuthToken] = useState(storedToken || null);
	const [authUser, setAuthUser] = useState(storedUser || null);

	useEffect(() => {
		const getLoggedUserData = async () => {
			if (authToken) {
				try {
					const userData = await fetchLoggedUserData(authToken);
					sessionStorage.setItem('authUser', JSON.stringify(userData));
					setAuthUser(userData);
				} catch (e) {
					if (e.response.data.error === 'jwt expired' || 'jwt malformed') {
						localStorage.removeItem('authToken');
						setAuthToken(null);
						setAuthUser(null);
						localStorage.removeItem('authToken');
						sessionStorage.removeItem('authUser');
					}
					console.error('error:', e.response.data.error);
				}
			}
		};

		getLoggedUserData();
	}, [authToken]);

	return (
		<AuthContext.Provider
			value={{ authToken, setAuthToken, authUser, setAuthUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}
