import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
	const location = useLocation();
	const locationPath = location.pathname.substring(1);

	return (
		<div className="container">
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<Link to="/dashboard">Home</Link>
					</li>
					<li className="breadcrumb-item active" aria-current="page">
						{locationPath}
					</li>
				</ol>
			</nav>
		</div>
	);
}
