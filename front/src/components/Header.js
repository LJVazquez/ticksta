import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../img/logo.png';

export default function Header() {
	const { authUser, setAuthUser, setAuthToken } = useContext(AuthContext);

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
						) : (
							<ul></ul>
						)}
						{authUser ? (
							<button className="btn btn-outline-danger" onClick={logOut}>
								Logout
							</button>
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
