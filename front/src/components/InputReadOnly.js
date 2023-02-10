import React from 'react';

export default function InputReadOnly({ children, value }) {
	return (
		<>
			<label className="fw-bold d-flex me-2">{children}</label>
			<div className="bg-light p-2 px-3 rounded-3 w-100">{value}</div>
		</>
	);
}
