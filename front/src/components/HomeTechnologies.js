import reactLogo from '../img/technologies/react.svg';
import bootstrapLogo from '../img/technologies/bootstrap.svg';
import expressLogo from '../img/technologies/express.svg';
import nodeLogo from '../img/technologies/node-js.svg';

export default function HomeTechnologies() {
	return (
		<div className="row mt-4 mt-md-5 px-3">
			<div className="col d-flex">
				<img src={reactLogo} alt="react logo" height={30} width={30} />
				<span className="fw-semibold fs-5 ms-2">React.js</span>
			</div>
			<div className="col d-flex">
				<img src={nodeLogo} alt="node logo" height={30} width={30} />
				<span className="fw-semibold fs-5 ms-2">Node.js</span>
			</div>
			<div className="col d-flex">
				<img src={expressLogo} alt="express logo" height={30} width={30} />
				<span className="fw-semibold fs-5 ms-2">Express.js</span>
			</div>
			<div className="col d-flex ">
				<img src={bootstrapLogo} alt="bootstrap logo" height={30} width={30} />
				<span className="fw-semibold fs-5 fs-md-1 ms-2">Bootstrap</span>
			</div>
		</div>
	);
}
