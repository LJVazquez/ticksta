import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../img/logo.png';

export default function Header() {
	const { authUser, setAuthUser, setAuthToken } = useContext(AuthContext);
	const { userRole } = authUser;

	const logOut = () => {
		setAuthUser(null);
		setAuthToken(null);
		window.sessionStorage.removeItem('authUser');
		window.localStorage.removeItem('authToken');
	};

	return (
		<nav className="navbar navbar-expand-lg bg-dark navbar-dark mb-3">
			<div className="container">
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
					className="collapse navbar-collapse d-lg-flex justify-content-between"
					id="navbarNav"
				>
					<ul className="navbar-nav">
						{userRole === 'ADMIN' && (
							<li className="nav-item">
								<Link to="/dashboard" className="nav-link active">
									Dashboard
								</Link>
							</li>
						)}

						<li className="nav-item">
							<Link to="/tickets" className="nav-link active">
								Tickets
							</Link>
						</li>
					</ul>
					<button className="btn btn-outline-danger" onClick={logOut}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
