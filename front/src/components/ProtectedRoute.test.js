import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Login from '../pages/Login';
import FourOFour from '../pages/FourOFour';
import AuthProviderMock from '../utils/AuthProviderMock';
import ProtectedRoute from './ProtectedRoute';

it('should render the children if the user is authenticated and has the required role', () => {
	const authUser = { userRole: 'ADMIN' };

	render(
		<AuthProviderMock authUser={authUser}>
			<ProtectedRoute authRoles={['ADMIN']}>
				<button>Children</button>
			</ProtectedRoute>
		</AuthProviderMock>
	);

	const children = screen.getByRole('button', { name: /children/i });

	expect(children).toBeInTheDocument();
});
