import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
	return (
		<div className="bg-light">
			<div className="" style={{ minHeight: 'calc(100vh - 100px)' }}>
				<Header />
				<div className="container-xl">{children}</div>
			</div>
			<Footer />
		</div>
	);
}
