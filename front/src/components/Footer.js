export default function Footer() {
	return (
		<footer className="navbar bg-dark text-white" style={{ height: 100 }}>
			<div className="container">
				<span className="text-white">© 2023 Ticksta Project</span>
				<ul className="nav col-md-4 justify-content-end list-unstyled">
					<a
						href="https://www.linkedin.com/in/lvazquez-dev/"
						target="_blank"
						className="me-3 text-white"
					>
						<i className="bi bi-linkedin"></i>
					</a>
					<a
						href="https://github.com/LJVazquez/guitrack/"
						target="_blank"
						className="me-3 text-white"
					>
						<i className="bi bi-github"></i>
					</a>
					<a href="mailto: ljvazquez00@gmail.com" className="me-3 text-white">
						<i className="bi bi-envelope-at-fill"></i>
					</a>
				</ul>
			</div>
		</footer>
	);
}
