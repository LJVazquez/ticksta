import React from 'react';

export default function TextArea({ name, rhfData, error, maxLength = null }) {
	return (
		<div className="mb-3">
			<label htmlFor={name?.toLocaleLowerCase()} className="form-label">
				{name}
			</label>
			<textarea
				id={name?.toLocaleLowerCase()}
				{...rhfData}
				style={{ height: 100, resize: 'none' }}
				maxLength={maxLength}
				className={`form-control ${error && 'is-invalid'}`}
			/>
			<small className="text-danger">{error?.message}</small>
		</div>
	);
}
