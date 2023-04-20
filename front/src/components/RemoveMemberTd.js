import { useState } from 'react';

export default function TeamMemberTd({ removeMember }) {
	const [isConfirmDeleteOn, setIsConfirmDeleteOn] = useState(false);

	return (
		<td>
			{isConfirmDeleteOn ? (
				<form onSubmit={removeMember} className="d-flex align-items-center">
					<button
						className="btn btn-danger btn-sm text-white py-0"
						aria-label="confirm remove member button"
					>
						¿Remover?
					</button>
				</form>
			) : (
				<button
					className="btn p-0"
					onClick={() => setIsConfirmDeleteOn(true)}
					aria-label="remove member button"
				>
					<i className="bi bi-trash3-fill text-danger"></i>
				</button>
			)}
		</td>
	);
}
