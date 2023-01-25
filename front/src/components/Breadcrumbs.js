import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { uriBreadcrumbsEquivalent } from '../utils/formats';

export default function Breadcrumbs() {
	const location = useLocation();
	const locationPath = location.pathname.split('/');
	const currentPathText = uriBreadcrumbsEquivalent[locationPath[1]];

	return (
		<div className="container">
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item">
						<Link to="/" className="text-decoration-none">
							Home
						</Link>
					</li>
					<li className="breadcrumb-item active" aria-current="page">
						{currentPathText}
					</li>
				</ol>
			</nav>
		</div>
	);
}
