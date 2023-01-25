import React from 'react';

export default function SubmitButton({ name, isLoading, loadingMessage }) {
	return isLoading ? (
		<button className="btn btn-primary" disabled>
			<span className="spinner-border spinner-border-sm me-2"></span>
			{loadingMessage}
		</button>
	) : (
		<button className="btn btn-info">{name}</button>
	);
}
