import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserRoleEquivalent } from '../utils/formats';
import { motion, AnimatePresence } from 'framer-motion';
import AddMemberForm from './AddMemberForm';
import RemoveMemberTd from './RemoveMemberTd';

const getSkeleton = () => {
	let tableRows = [];

	for (let i = 0; i < 5; i++) {
		tableRows.push(
			<tr key={i}>
				<td colSpan={4}>
					<span className="placeholder col-12"></span>
				</td>
			</tr>
		);
	}

	return tableRows;
};

const getUsersRows = (users, removeMember, authUser) => {
	return users?.length > 0 ? (
		users.map((user) => {
			return (
				<tr key={user.id + user.name}>
					<td className="text-nowrap">{user.name}</td>
					<td className="text-nowrap">{user.email}</td>
					<td className="text-nowrap">{UserRoleEquivalent[user.role]}</td>
					{(authUser.userRole === 'MANAGER' ||
						authUser.userRole === 'ADMIN') && (
						<RemoveMemberTd
							user={user}
							removeMember={() => removeMember(user.email)}
						/>
					)}
				</tr>
			);
		})
	) : (
		<tr>
			<td colSpan={4} className="text-center">
				No hay usuarios asignados
			</td>
		</tr>
	);
};

const smallAnimationSettings = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export default function ProjectUsersTable({ users, addMember, removeMember }) {
	const [isAddMemberDisplayed, setIsAddMemberDisplayed] = useState(false);
	const [userAssigned, setUserAssigned] = useState(false);
	const { authUser } = useContext(AuthContext);

	const onUserAssignment = () => {
		setIsAddMemberDisplayed(false);
		setUserAssigned(true);
		setTimeout(() => setUserAssigned(false), 4000);
	};

	return (
		<div className="p-3 bg-white rounded-4 shadow-sm mx-1">
			<div className="mb-2 d-flex align-items-center justify-content-between">
				<h5>
					<i className="bi bi-person-fill text-info"></i> Equipo
				</h5>
				{(authUser.userRole === 'MANAGER' || authUser.userRole === 'ADMIN') &&
					!isAddMemberDisplayed && (
						<div>
							<AnimatePresence>
								{userAssigned && (
									<motion.small
										className="text-success"
										{...smallAnimationSettings}
									>
										<i className="bi bi-check me-1"></i>Miembro asignado
									</motion.small>
								)}
							</AnimatePresence>
							<button
								className="btn btn-sm mb-3 mb-md-0"
								onClick={() => setIsAddMemberDisplayed(true)}
							>
								<i className="bi bi-plus-circle-fill"></i> Agregar usuario
							</button>
						</div>
					)}
			</div>

			{isAddMemberDisplayed && (
				<>
					<AddMemberForm
						currentUsers={users}
						addMember={addMember}
						onUserAssignment={onUserAssignment}
					/>
				</>
			)}

			<div className="table-responsive bg-light p-3 mb-3 mx-md-3 rounded-4">
				<table className="table table-light table-hover table-sm">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Email</th>
							<th>Rol</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users
							? getUsersRows(users, removeMember, authUser)
							: getSkeleton()}
					</tbody>
				</table>
			</div>
		</div>
	);
}
