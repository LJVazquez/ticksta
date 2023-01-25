import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function RegisterUser() {
	const [isUserCreated, setIsUserCreated] = useState(false);

	return isUserCreated ? (
		<div>
			<h1>¡Usuario creado con exito!</h1>
			<Link to="/login">Ir al login</Link>
		</div>
	) : (
		<RegisterForm setIsUserCreated={setIsUserCreated} />
	);
}
