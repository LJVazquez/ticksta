import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';

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
					path="new-ticket"
					element={
						<ProtectedRoute authRoles={['USER']}>
							<NewTicket />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</AuthProvider>
	);
}

export default App;
