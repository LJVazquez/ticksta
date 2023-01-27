import Layout from '../components/Layout';
import HomePageMainText from '../components/HomePageMainText';
import ticket from '../img/ticket-hero.png';

import HomeTechnologies from '../components/HomeTechnologies';

export default function Home() {
	return (
		<Layout>
			<div className="row flex-md-row-reverse align-items-center bg-dark-subtle mt-lg-4 text-white p-5">
				<div className="col-12 col-md-6 align-items-center">
					<img src={ticket} className="d-block img-fluid mb-lg-0 p-5" />
				</div>
				<HomePageMainText />
			</div>
			<HomeTechnologies />
		</Layout>
	);
}
