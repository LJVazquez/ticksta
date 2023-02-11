export default function InputSelect({ name, options, rhfData, error }) {
	return (
		<div className="mb-3">
			<label htmlFor={name?.toLocaleLowerCase()} className="form-label fw-bold">
				{name}
			</label>
			<select
				id={name?.toLocaleLowerCase()}
				{...rhfData}
				className={`form-select rounded-3 ${error && 'is-invalid'}`}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<small className="text-danger">{error?.message}</small>
		</div>
	);
}
