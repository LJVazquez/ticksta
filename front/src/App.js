import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
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
				path="ticket-detail/:id"
				element={
					<ProtectedRoute>
						<TicketDetail />
					</ProtectedRoute>
				}
			/>
			<Route
				path="new-ticket"
				element={
					<ProtectedRoute>
						<NewTicket />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
