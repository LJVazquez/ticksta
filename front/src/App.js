import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import FourOFour from './pages/FourOFour';
import FourOOne from './pages/FourOOne';
import Users from './pages/Users';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<RegisterUser />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute authRoles={['ADMIN']}>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="tickets"
					element={
						<ProtectedRoute>
							<Tickets />
						</ProtectedRoute>
					}
				/>
				<Route
					path="ticket-detail/:ticketId"
					element={
						<ProtectedRoute>
							<TicketDetail />
						</ProtectedRoute>
					}
				/>
				<Route
					path="projects/:projectId/new-ticket"
					element={
						<ProtectedRoute authRoles={['USER']}>
							<NewTicket />
						</ProtectedRoute>
					}
				/>
				<Route
					path="users"
					element={
						<ProtectedRoute authRoles={['ADMIN']}>
							<Users />
						</ProtectedRoute>
					}
				/>
				<Route
					path="projects"
					element={
						<ProtectedRoute>
							<Projects />
						</ProtectedRoute>
					}
				/>
				<Route
					path="projects/:projectId"
					element={
						<ProtectedRoute>
							<ProjectDetail />
						</ProtectedRoute>
					}
				/>
				<Route path="404" element={<FourOFour />} />
				<Route path="401" element={<FourOOne />} />
				<Route path="*" element={<Navigate to="/404" replace={true} />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
