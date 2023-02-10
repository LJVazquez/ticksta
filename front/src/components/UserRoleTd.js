import React, { useContext, useState } from 'react';
import { UserRoleEquivalent } from '../utils/formats';
import { changeUserRole } from '../services/users';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
const smallAnimationSettings = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export default function UserRoleTd({ user, setUsers }) {
	const [isEditModeOn, setIsEditModeOn] = useState(false);
	const [updateRoleError, setUpdateRoleError] = useState(false);
	const [roleChangeSuccess, setRoleChangeSuccess] = useState(false);
	const [userRoleSelect, setUserRoleSelect] = useState(user.role);
	const { authToken } = useContext(AuthContext);

	const handleError = useHandleAxiosError();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const updatedUser = await changeUserRole(
				user.id,
				userRoleSelect,
				authToken
			);

			setUsers((prevUsers) => {
				let prevUsersUpdated = prevUsers.map((prevUser) => {
					return prevUser.id === user.id ? updatedUser : prevUser;
				});

				return prevUsersUpdated;
			});

			setIsEditModeOn(false);
			setRoleChangeSuccess(true);

			setTimeout(() => {
				setRoleChangeSuccess(false);
			}, 4000);
		} catch (e) {
			handleError(e);

			setIsEditModeOn(false);
			setUpdateRoleError(true);

			setTimeout(() => setUpdateRoleError(false), 4000);
		}
	};

	const getUpdateRoleButton = () => {
		if (updateRoleError) {
			return (
				<motion.span className="ms-2 text-danger" {...smallAnimationSettings}>
					<i className="bi bi-exclamation-triangle-fill"></i> Reintentar...
				</motion.span>
			);
		} else if (roleChangeSuccess) {
			return (
				<motion.small className="ms-2 text-success" {...smallAnimationSettings}>
					<i className="bi bi-check-lg"></i>
				</motion.small>
			);
		}

		return (
			<button className="btn" onClick={() => setIsEditModeOn(true)}>
				<i className="bi bi-pencil-fill text-warning"></i>
			</button>
		);
	};

	if (isEditModeOn) {
		return (
			<td>
				<form onSubmit={handleSubmit} className="d-flex align-items-center">
					<select
						className="border-light p-1 rounded-3"
						value={userRoleSelect}
						onChange={(e) => setUserRoleSelect(e.target.value)}
					>
						<option value="ADMIN">Admin</option>
						<option value="MANAGER">Manager</option>
						<option value="USER">Usuario</option>
						<option value="DEV">Desarrollador</option>
					</select>
					<button className="btn btn-sm">
						<i className="bi bi-arrow-left-right text-info"></i>
					</button>
				</form>
			</td>
		);
	} else {
		return (
			<td className="d-flex align-items-center">
				{UserRoleEquivalent[user.role]}
				<AnimatePresence>{getUpdateRoleButton()}</AnimatePresence>
			</td>
		);
	}
}
