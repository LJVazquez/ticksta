import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
	return (
		<>
			<div
				className="bg-light pb-4"
				style={{ minHeight: 'calc(100vh - 100px)' }}
			>
				<Header />
				<div className="container">{children}</div>
			</div>
			<Footer />
		</>
	);
}
