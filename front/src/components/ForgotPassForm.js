import { useState } from 'react';

export default function ForgotPassForm({ formToggler }) {
	const [email, setEmail] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('email', email);
		setEmail('');
	};

	return (
		<form className="card p-3" onSubmit={(e) => handleSubmit(e)}>
			<h1>Recuperar contraseña</h1>
			<div className="mb-3">
				<label htmlFor="emailInput" className="form-label">
					Email
				</label>
				<input
					type="email"
					className="form-control"
					id="emailInput"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className="btn btn-primary">
				Recuperar
			</button>
			<p role="button" className="text-end mt-2 pe-auto" onClick={formToggler}>
				Ir al login
			</p>
		</form>
	);
}
