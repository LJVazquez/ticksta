import React from 'react';
import Layout from '../components/Layout';
import brokenTicket from '../img/ticket-broken.png';

export default function FourOOne() {
	return (
		<Layout>
			<div className="text-center mt-5">
				<img src={brokenTicket} alt="broken ticket" height={300} />
				<h1 className="display-1 text-danger">401</h1>
				<p>No tenes autorizacion para ver esto :(</p>
			</div>
		</Layout>
	);
}
