import React from 'react';

export default function Input({ name, type = 'text', rhfData, error }) {
	return (
		<div className="mb-3">
			<label htmlFor={name?.toLocaleLowerCase()} className="form-label fw-bold">
				{name}
			</label>
			<input
				id={name?.toLocaleLowerCase()}
				type={type}
				{...rhfData}
				className={`form-control rounded-3 ${error && 'is-invalid'}`}
			/>
			<small className="text-danger">{error?.message}</small>
		</div>
	);
}
