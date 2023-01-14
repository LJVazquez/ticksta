import { useState } from 'react';
import ForgotPassForm from '../components/ForgotPassForm';
import LoginForm from '../components/LoginForm';

export default function Login() {
	const [forgotPasswordActive, setForgotPasswordActive] = useState(false);

	const formToggler = () => {
		setForgotPasswordActive((prevState) => !prevState);
	};

	return (
		<div>
			{forgotPasswordActive ? (
				<LoginForm formToggler={formToggler} />
			) : (
				<ForgotPassForm formToggler={formToggler} />
			)}
		</div>
	);
}
