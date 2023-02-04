import React from 'react';

export default function InputReadOnly({ children, value }) {
	return (
		<>
			<label className="fw-bold d-flex me-2">{children}</label>
			<input
				value={value}
				className="form-control rounded-3 bg-light border-0"
				readOnly
			/>
		</>
	);
}
