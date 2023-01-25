import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div>
			<img src="https://ps.w.org/easy-under-construction/assets/banner-772x250.png?rev=2417171" />
			<br />
			<Link to="/login">login</Link>
		</div>
	);
}
