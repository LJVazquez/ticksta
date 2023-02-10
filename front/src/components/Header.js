import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../img/logo.png';

export default function Header() {
	const { authUser, setAuthUser, setAuthToken } = useContext(AuthContext);
	const location = useLocation();
	const locationPath = location.pathname;

	const logOut = () => {
		setAuthUser(null);
		setAuthToken(null);
		window.sessionStorage.removeItem('authUser');
		window.localStorage.removeItem('authToken');
	};

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-dark navbar-dark mb-3">
				<div className="container-xl">
					<Link className="navbar-brand" to="/">
						<img src={logo} alt="logo" height={30} />
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className="collapse navbar-collapse d-lg-flex justify-content-between text-center"
						id="navbarNav"
					>
						{authUser ? (
							<ul className="navbar-nav">
								{authUser?.userRole === 'ADMIN' && (
									<>
										<li className="nav-item">
											<Link
												to="/dashboard"
												className={`nav-link ${
													locationPath.includes('dashboard') && 'active'
												}`}
											>
												Dashboard
											</Link>
										</li>
										<li className="nav-item">
											<Link
												to="/users"
												className={`nav-link ${
													locationPath.includes('users') && 'active'
												}`}
											>
												Usuarios
											</Link>
										</li>
									</>
								)}

								<li className="nav-item d-lg-none">
									<span className="nav-link">
										<i className="bi bi-person-circle me-2"></i>
										{authUser.name}
									</span>
								</li>

								<li className="nav-item">
									<Link
										to="/projects"
										className={`nav-link ${
											locationPath.includes('projects') && 'active'
										}`}
									>
										Proyectos
									</Link>
								</li>

								<li className="nav-item">
									<Link
										to="/tickets"
										className={`nav-link ${
											locationPath.includes('tickets') && 'active'
										}`}
									>
										Tickets
									</Link>
								</li>
								<li className="nav-item d-lg-none">
									<span onClick={logOut} className="nav-link text-danger">
										Logout
									</span>
								</li>
							</ul>
						) : (
							<ul></ul>
						)}
						{authUser ? (
							<div className="dropdown d-none d-lg-block">
								<span
									className="dropdown-toggle text-white"
									type="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<i className="bi bi-person-circle me-2"></i>
									{authUser.name}
								</span>
								<ul className="dropdown-menu">
									<li
										className="dropdown-item text-danger"
										style={{ cursor: 'pointer' }}
									>
										<span onClick={logOut}>
											<i className="bi bi-door-open-fill me-2"></i>Logout
										</span>
									</li>
								</ul>
							</div>
						) : (
							<Link to="/login" className="btn btn-outline-success">
								Login
							</Link>
						)}
					</div>
				</div>
			</nav>
		</>
	);
}
