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
	const [guestLogin, setGuestLogin] = useState(false);
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
			navigate('/projects');
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
			const testUserDomain = process.env[`REACT_APP_TEST_USER_DOMAIN`];
			const testUserPass = process.env.REACT_APP_TEST_USER_PASS;
			const testUserEmail = role.toLowerCase() + testUserDomain;

			const authToken = await login(testUserEmail, testUserPass);

			setAuthToken(authToken.jwt);
			localStorage.setItem('authToken', JSON.stringify(authToken.jwt));
		} catch (e) {
			handleError(e);
			setAuthToken(null);
			setLoginError(e.response.data.error);
		}
	};

	const getLoginBody = () => {
		if (guestLogin) {
			return (
				<>
					<div className="col-12 col-md-6 bg-white p-5 rounded-5 rounded-start d-flex flex-column gap-3">
						<h1 className="text-center">
							<img src={ticketHero} height="50" />
							<br />
							Bienvenido!
						</h1>
						<p className="text-center">Selecciona tu usuario de prueba:</p>
						<button
							type="button"
							className="btn btn-dark"
							onClick={() => loginTestUser('ADMIN')}
						>
							<i className="bi bi-person-circle"></i> ADMIN
						</button>
						<button
							type="button"
							className="btn btn-primary text-white"
							onClick={() => loginTestUser('MANAGER')}
						>
							<i className="bi bi-person-circle"></i> MANAGER
						</button>
						<button
							type="button"
							className="btn btn-info"
							onClick={() => loginTestUser('DEV')}
						>
							<i className="bi bi-person-circle"></i> DEV
						</button>
						<button
							type="button"
							className="btn btn-success"
							onClick={() => loginTestUser('USER')}
						>
							<i className="bi bi-person-circle"></i> USER
						</button>
						<span className="text-end">
							¿Tenes cuenta?{' '}
							<span
								className="text-primary"
								style={{ cursor: 'pointer' }}
								onClick={() => setGuestLogin(false)}
							>
								Ingresa con tu email!
							</span>
						</span>
					</div>
				</>
			);
		}
		return (
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
					</div>
				</form>
				<span className="text-end">
					¿No tenes usuario?{' '}
					<Link to="/register" className="text-end mt-2 text-decoration-none">
						Registrate,
					</Link>{' '}
					o usa una{' '}
					<span
						className="text-primary"
						style={{ cursor: 'pointer' }}
						onClick={() => setGuestLogin(true)}
					>
						cuenta de prueba!
					</span>
				</span>
			</div>
		);
	};

	return (
		<Layout>
			<div className="row" style={{ height: '50vh' }}>
				<div className="col-6 bg-dark-subtle d-flex align-items-center justify-content-center d-none d-md-flex rounded-5 rounded-end">
					<img src={loginImage} alt="login image" className="img-fluid" />
				</div>
				{getLoginBody()}
			</div>
		</Layout>
	);
}
