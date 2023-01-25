import React from 'react';

export default function Input({ name, type = 'text', rhfData, error }) {
	return (
		<div className="mb-3">
			<label htmlFor={name?.toLocaleLowerCase()} className="form-label">
				{name}
			</label>
			<input
				id={name?.toLocaleLowerCase()}
				type={type}
				{...rhfData}
				className={`form-control ${error && 'is-invalid'}`}
			/>
			<small className="text-danger">{error?.message}</small>
		</div>
	);
}
