export default function TextAreaReadOnly({ children, value }) {
	return (
		<>
			<label className="fw-bold d-flex mb-2">{children}</label>
			<textarea
				style={{ resize: 'none' }}
				className="form-control bg-light rounded-3 border-0"
				readOnly
				value={value}
				rows="4"
				cols="50"
			/>
		</>
	);
}
