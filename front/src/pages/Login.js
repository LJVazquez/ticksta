import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';
import Layout from '../components/Layout';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/auth';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { loginInputConstraints } from '../utils/constraints';
import loginImage from '../img/login-illus.png';
import ticketHero from '../img/ticket-hero.png';

export default function Login() {
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [loginError, setLoginError] = useState(null);
	const { authUser, setAuthToken } = useContext(AuthContext);
	const handleError = useHandleAxiosError();
	const navigate = useNavigate();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm();

	useEffect(() => {
		if (authUser !== null) {
			authUser.userRole === 'ADMIN'
				? navigate('/dashboard')
				: navigate('/projects');
		}
	}, [authUser]);

	const onSubmit = async (formData) => {
		setIsLoginLoading(true);

		try {
			const authToken = await login(formData.email, formData.password);

			setAuthToken(authToken.jwt);
			localStorage.setItem('authToken', JSON.stringify(authToken.jwt));

			setIsLoginLoading(false);
		} catch (e) {
			handleError(e);
			setAuthToken(null);
			setLoginError(e.response.data.error);
			setIsLoginLoading(false);
		}
	};

	const loginTestUser = async (role) => {
		try {
			const testEmail = process.env[`REACT_APP_TEST_${role}_EMAIL`];
			const testPass = process.env.REACT_APP_TEST_PASS;

			const authToken = await login(testEmail, testPass);

			setAuthToken(authToken.jwt);
			localStorage.setItem('authToken', JSON.stringify(authToken.jwt));
		} catch (e) {
			handleError(e);
			setAuthToken(null);
			setLoginError(e.response.data.error);
		}
	};

	return (
		<Layout>
			<div className="row" style={{ height: '50vh' }}>
				<div className="col-6 bg-dark-subtle d-flex align-items-center justify-content-center d-none d-md-flex rounded-5 rounded-end">
					<img src={loginImage} alt="login image" className="img-fluid" />
				</div>
				<div className="col-12 col-md-6 bg-white p-5 rounded-5 rounded-start d-flex flex-column justify-content-between">
					<form onSubmit={handleSubmit(onSubmit)}>
						<h1 className="text-center">
							<img src={ticketHero} height="50" />
							<br />
							Bienvenido!
						</h1>
						{loginError && (
							<div
								className="alert alert-danger d-flex align-items-center"
								role="alert"
							>
								{loginError}
							</div>
						)}

						<Input
							name={'Email'}
							error={errors.email}
							rhfData={register('email', loginInputConstraints['email'])}
						/>
						<Input
							name={'Password'}
							error={errors.password}
							type="password"
							rhfData={register('password', loginInputConstraints['password'])}
						/>

						<div className="row">
							<div className="col-12 d-grid mb-3">
								<SubmitButton name={'Login'} isLoading={isLoginLoading} />
							</div>
							<div className="col-12 col-lg-6 d-grid mb-2">
								<span
									className="btn btn-sm btn-warning"
									onClick={() => loginTestUser('USER')}
								>
									Usuario de prueba
								</span>
							</div>
							<div className="col-12 col-lg-6 d-grid mb-2">
								<span
									className="btn btn-sm btn-success"
									onClick={() => loginTestUser('ADMIN')}
								>
									Admin de prueba
								</span>
							</div>
						</div>
					</form>
					<span className="text-end">
						¿No tenes usuario?{' '}
						<Link
							to="/register"
							className="text-end mt-2 pe-auto text-decoration-none"
						>
							Registrate!
						</Link>
					</span>
				</div>
			</div>
		</Layout>
	);
}
