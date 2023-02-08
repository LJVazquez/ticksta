import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProjectsPageHeader(props) {
	const { searchValue, setSearchValue } = props;

	const { authUser } = useContext(AuthContext);

	return (
		<div className="row mb-5 justify-content-between">
			<h1 className="fw-bold">
				<i className="bi bi-kanban-fill text-danger"></i> Proyectos
			</h1>
			<motion.div layoutId="newTicketForm" className="col-auto">
				{authUser.userRole === 'MANAGER' && (
					<div>
						<Link to="/new-project" className="btn btn-sm mb-3 mb-md-0">
							<i className="bi bi-plus-circle-fill"></i> Nuevo proyecto
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
			</div>
		</div>
	);
}
