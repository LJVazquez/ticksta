import React from 'react';
import Layout from '../components/Layout';
import brokenTicket from '../img/ticket-broken.png';

export default function FourOFour() {
	return (
		<Layout>
			<div className="text-center mt-5">
				<img src={brokenTicket} alt="broken ticket" height={300} />
				<h1 className="display-1 text-danger">404</h1>
				<p>No pudimos encontrar nada en esta URL :(</p>
			</div>
		</Layout>
	);
}
