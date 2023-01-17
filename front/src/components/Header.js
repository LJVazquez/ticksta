import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
	const navigate = useNavigate();

	const logOut = () => {
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-expand-lg bg-primary mb-3">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					Logo
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
						<li className="nav-item">
							<Link to="/dashboard" className="nav-link active">
								Dashboard
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/tickets" className="nav-link active">
								Tickets
							</Link>
						</li>
					</ul>
					<button className="btn btn-danger" onClick={logOut}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
