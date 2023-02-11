import { useState } from 'react';

export default function HomePageMainText() {
	const [isReadMoreOn, setIsReadMoreOn] = useState(false);
	return (
		<>
			<div className="col-12 col-md-6">
				<h1 className="display-6 fw-bold mb-3">
					Ticksta! Mini proyecto de React y Node :)
				</h1>
				<p className="lead">
					TIckesta es una pequeña single-page app (SPA) de gestion de tickets
					hecha en React, Node y todo su ecosistema.
				</p>
				<div className="d-none d-md-block">
					<p className="lead">
						Su arquitectura front-end basada en componentes la hace facil de
						mantener y escalar. Ademas, su intuitiva intuitiva interfaz
						responsive la hacen super user-friendly.
					</p>
					<p className="lead">
						A pesar de su pequeño dominio, este proyecto esta pensado para
						demostrar capacidad en construir web apps full stack, y todas las
						competencias necesarias para ello.
					</p>
				</div>
			</div>
			<div className="d-md-none">
				{!isReadMoreOn && (
					<button
						className="btn btn-dark-subtle text-white p-0"
						data-bs-toggle="collapse"
						data-bs-target="#main-text-collapsed"
						aria-expanded="false"
						aria-controls="main-text-collapsed"
						onClick={() => setIsReadMoreOn(true)}
					>
						Leer mas
					</button>
				)}

				<div className="collapse" id="main-text-collapsed">
					<div>
						<p className="lead">
							TIckesta es una pequeña single-page app (SPA) de gestion de
							tickets hecha en React, Node y todo su ecosistema.
						</p>
						<p className="lead">
							Su arquitectura front-end basada en componentes la hace facil de
							mantener y escalar. Ademas, su intuitiva intuitiva interfaz
							responsive la hacen super user-friendly.
						</p>
						<p className="lead">
							A pesar de su pequeño dominio, este proyecto esta pensado para
							demostrar capacidad en construir web apps full stack, y todas las
							competencias necesarias para ello.
						</p>
					</div>
				</div>
				{isReadMoreOn && (
					<button
						className="btn btn-dark-subtle text-white p-0"
						data-bs-toggle="collapse"
						data-bs-target="#main-text-collapsed"
						aria-expanded="false"
						aria-controls="main-text-collapsed"
						onClick={() => setIsReadMoreOn(false)}
					>
						Leer menos
					</button>
				)}
			</div>
		</>
	);
}
