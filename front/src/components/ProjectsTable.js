import { Link } from 'react-router-dom';
import {
	formatDate,
	ticketStatusEquivalent,
	ticketStatusBackgroundColors,
} from '../utils/formats';

import { motion, AnimatePresence } from 'framer-motion';

const trAnimationSettings = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.2 },
};

const linkAnimationSettings = {
	whileHover: {
		scale: 1.01,
	},
};

const getSkeleton = () => {
	let tableRows = [];

	for (let i = 0; i < 5; i++) {
		tableRows.push(
			<tr key={i} {...trAnimationSettings}>
				<td colSpan={4}>
					<span className="placeholder col-12"></span>
				</td>
			</tr>
		);
	}

	return tableRows;
};

const getProjectRows = (projects) => {
	return projects?.length > 0 ? (
		projects.map((project) => {
			const createdAt = formatDate(project.createdAt);

			return (
				<motion.tr initial="false" key={project.id} {...trAnimationSettings}>
					<th scope="row">{project.id}</th>
					<td className="text-nowrap">
						<Link
							to={`/projects/${project.id}`}
							className="text-decoration-none"
						>
							<motion.div {...linkAnimationSettings}>{project.name}</motion.div>
						</Link>
					</td>
					<td>{project._count.assignedUsers}</td>
					<td>{project._count.tickets}</td>
					<td>{createdAt}</td>
				</motion.tr>
			);
		})
	) : (
		<tr>
			<td colSpan={4} className="text-center">
				No se encontraron proyectos
			</td>
		</tr>
	);
};

export default function ProjectsTable({ projects }) {
	return (
		<div className="table-responsive bg-light p-3 mb-3 rounded-4">
			<table className="table table-light table-hover table-sm">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Nombre</th>
						<th scope="col">Usuarios</th>
						<th scope="col">Tickets</th>
						<th scope="col">Creado</th>
					</tr>
				</thead>
				<tbody>
					<AnimatePresence>
						{projects ? getProjectRows(projects) : getSkeleton()}
					</AnimatePresence>
				</tbody>
			</table>
		</div>
	);
}
