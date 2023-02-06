import React from 'react';

export default function Pagination({
	pages,
	currentPage,
	setCurrentPage,
	goToNextPage,
	goToPrevPage,
}) {
	return (
		<nav>
			<ul className="pagination justify-content-center">
				<li className="page-item" onClick={goToPrevPage}>
					<button className="page-link rounded-3 rounded-end">Anterior</button>
				</li>

				{pages &&
					pages.map((page) => (
						<li key={page} className="page-item">
							<button
								className={`page-link ${currentPage === page && 'active'}`}
								onClick={() => setCurrentPage(page)}
							>
								{page}
							</button>
						</li>
					))}

				<li className="page-item">
					<button
						className="page-link rounded-3 rounded-start"
						onClick={goToNextPage}
					>
						Siguiente
					</button>
				</li>
			</ul>
		</nav>
	);
}
