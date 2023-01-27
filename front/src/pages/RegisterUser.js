import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import loginImage from '../img/login-illus.png';
import Layout from '../components/Layout';
import successImage from '../img/success.jpg';

export default function RegisterUser() {
	const [isUserCreated, setIsUserCreated] = useState(false);
	return (
		<Layout>
			<div className="row" style={{ height: '50vh' }}>
				<div className="col-6 bg-dark-subtle d-flex align-items-center justify-content-center d-none d-md-flex rounded-5 rounded-end">
					<img src={loginImage} alt="login image" className="img-fluid" />
				</div>
				<div className="col-12 col-md-6 bg-white p-5 rounded-5 rounded-start d-flex flex-column justify-content-between">
					{isUserCreated ? (
						<div>
							<img
								src={successImage}
								alt="success"
								className="img-fluid mb-2"
							/>
							<p className="text-center mt-3">
								¡Usuario creado con exito! <Link to="/login">Ir al login</Link>
							</p>
						</div>
					) : (
						<>
							<RegisterForm setIsUserCreated={setIsUserCreated} />
							<span className="text-end">
								Ya tenes usuario?{' '}
								<Link
									to="/login"
									className="text-end mt-2 pe-auto text-decoration-none"
								>
									Logeate!
								</Link>
							</span>
						</>
					)}
				</div>
			</div>
		</Layout>
	);
}
