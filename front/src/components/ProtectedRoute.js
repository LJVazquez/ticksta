import { Navigate, Route } from 'react-router-dom';

const isLoggedIn = true;

export default function ProtectedRoute({ children }) {
	return isLoggedIn ? children : <Navigate to="/login" replace={true} />;
}
