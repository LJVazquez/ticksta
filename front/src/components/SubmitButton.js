export default function SubmitButton({ name, isLoading, loadingMessage }) {
	return isLoading ? (
		<button
			className="btn btn-primary"
			disabled
			aria-label="loading-button"
			data-testid="loading-button"
		>
			<span className="spinner-border spinner-border-sm me-2"></span>
			{loadingMessage}
		</button>
	) : (
		<button className="btn bg-dark-subtle text-white rounded-3" type="submit">
			{name}
		</button>
	);
}
