import { UserRoleEquivalent } from '../utils/formats';
import { motion, AnimatePresence } from 'framer-motion';
import UserRoleTd from './UserRoleTd';

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

const getUsersRows = (users, setUsers) => {
	return users?.length > 0 ? (
		users.map((user) => {
			return (
				<motion.tr initial="false" key={user.id} {...trAnimationSettings}>
					<th scope="row">{user.id}</th>
					<td>
						<motion.div {...linkAnimationSettings}>{user.name}</motion.div>
					</td>
					<td>{user.email}</td>
					<UserRoleTd user={user} setUsers={setUsers} />
				</motion.tr>
			);
		})
	) : (
		<tr>
			<td colSpan={4} className="text-center">
				No se encontraron usuarios
			</td>
		</tr>
	);
};

export default function UsersTable({ users, setUsers }) {
	return (
		<div className="table-responsive bg-light p-3 mb-3 rounded-4 ">
			<table className="table table-light table-hover table-sm">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Nombre</th>
						<th scope="col">Email</th>
						<th scope="col">Rol</th>
					</tr>
				</thead>
				<tbody>
					<AnimatePresence>
						{users ? getUsersRows(users, setUsers) : getSkeleton()}
					</AnimatePresence>
				</tbody>
			</table>
		</div>
	);
}
