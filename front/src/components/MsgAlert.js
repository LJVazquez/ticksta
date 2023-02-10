import React from 'react';

export default function ErrorAlert({ color, children }) {
	return (
		<div
			className={`alert alert-${color} fade show rounded-3 py-1 px-3 d-flex align-items-center justify-content-between`}
			role="alert"
		>
			{children}
		</div>
	);
}
