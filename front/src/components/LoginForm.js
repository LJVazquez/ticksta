import { useState } from 'react';

export default function LoginForm({ formToggler }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('email', email);
		console.log('password', password);
		setEmail('');
		setPassword('');
	};

	return (
		<form className="card p-3" onSubmit={(e) => handleSubmit(e)}>
			<h1>Login</h1>
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
			<div className="mb-3">
				<label htmlFor="passwordInput" className="form-label">
					Password
				</label>
				<input
					type="password"
					className="form-control"
					id="passwordInput"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className="btn btn-primary">
				Login
			</button>
			<p role="button" className="text-end mt-2 pe-auto" onClick={formToggler}>
				Olvidé mi contraseña
			</p>
		</form>
	);
}
