export default function ErrorAlert({ children }) {
	return (
		<div
			className="alert alert-danger alert-dismissible fade show rounded-3 py-1 px-3 d-flex align-items-center justify-content-between"
			role="alert"
		>
			{children}
			<button
				type="button"
				className="btn btn-sm"
				data-bs-dismiss="alert"
				aria-label="Close"
			>
				X
			</button>
		</div>
	);
}
