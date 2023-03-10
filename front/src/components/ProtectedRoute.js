import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, authRoles }) {
	const { authUser } = useContext(AuthContext);
	const userRoleIsAuthorized =
		authUser && authRoles
			? authRoles.some((role) => role === authUser.userRole)
			: true;

	if (!authUser) return <Navigate to="/login" replace={true} />;
	if (!userRoleIsAuthorized) return <Navigate to="/404" replace={true} />;

	return children;
}
