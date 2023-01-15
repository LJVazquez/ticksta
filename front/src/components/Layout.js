import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

export default function Layout({ children }) {
	return (
		<div>
			<Header />
			<Breadcrumbs />
			<div className="container my-3">{children}</div>
			<Footer />
		</div>
	);
}
