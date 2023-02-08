import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function TicketsPageHeader(props) {
	const { searchValue, setSearchValue, selectValue, setSelectValue } = props;

	const { authUser } = useContext(AuthContext);

	return (
		<div className="row mb-5 justify-content-between">
			<h1 className="fw-bold">
				<i className="bi bi-ticket-fill text-warning me-2"></i>Tickets
			</h1>
			<motion.div layoutId="newTicketForm" className="col-auto">
				{authUser.userRole === 'USER' && (
					<div>
						<Link to="/new-ticket" className="btn btn-sm mb-3 mb-md-0">
							<i className="bi bi-plus-circle-fill"></i> Nuevo ticket
						</Link>
					</div>
				)}
			</motion.div>
			<div className="col-12 col-md-auto row mx-0">
				<div className="col-12 col-md-auto">
					<div className="input-group input-group-sm mb-3 mb-md-0">
						<span className="input-group-text bg-dark-subtle border-0 text-white">
							<i className="bi bi-search"></i>
						</span>
						<input
							id="searchInput"
							placeholder="Buscar"
							className="form-control border border-dark-subtle"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</div>
				</div>
				<div className="col-12 col-md-auto">
					<div className="input-group input-group-sm">
						<select
							id="statusInput"
							className="form-select border border-dark-subtle"
							value={selectValue}
							onChange={(e) => setSelectValue(e.target.value)}
						>
							<option value="ALL">Todos</option>
							<option value="OPEN">Abierto</option>
							<option value="INPROG">En progreso</option>
							<option value="PENDING">Pendiente</option>
							<option value="RESOLVED">Resuelto</option>
							<option value="CLOSED">Cerrado</option>
						</select>
						<span className="input-group-text bg-dark-subtle border-0 text-white">
							<i className="bi bi-card-checklist"></i>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
