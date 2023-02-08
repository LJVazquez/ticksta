import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import { fetchAssignableUsers } from '../services/users';

export default function AddMemberForm({
	currentUsers,
	addMember,
	onUserAssignment,
}) {
	const [assignableUsers, setAssignableUsers] = useState();
	const [selectedMember, setSelectedMember] = useState('');
	const { authToken } = useContext(AuthContext);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const _fetchAssignableUsers = async () => {
			try {
				const users = await fetchAssignableUsers(authToken);

				const currentUserIds = currentUsers.map(
					(currentUser) => currentUser.id
				);

				const usersNotInProject = users.filter((user) => {
					return !currentUserIds.includes(user.id);
				});

				setAssignableUsers(usersNotInProject);
			} catch (e) {
				handleError(e);
			}
		};
		_fetchAssignableUsers();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (selectedMember.length > 0) {
			addMember(selectedMember);

			const usersLeft = assignableUsers.filter(
				(assignableUser) => assignableUser.email !== selectedMember
			);
			setAssignableUsers(usersLeft);

			setSelectedMember('');
			onUserAssignment();
		}
	};

	return (
		<form
			className="bg-light p-3 mx-3 rounded-4 mb-3"
			onSubmit={(e) => handleSubmit(e)}
		>
			{assignableUsers?.length > 0 ? (
				<>
					<p>Asignar al equipo</p>
					<div className="input-group">
						<input
							value={selectedMember}
							onChange={(e) => setSelectedMember(e.target.value)}
							type="text"
							className="form-control rounded-3 rounded-end"
							list="members"
							autoComplete="off"
						/>
						<button className="btn btn-dark rounded-3 rounded-start">
							Asignar
						</button>
					</div>
				</>
			) : (
				<span className="text-danger">
					No se encontraron usuarios asignables
				</span>
			)}

			<datalist id="members">
				{assignableUsers?.map((user) => (
					<option key={user.id + user.name} value={user.email}>
						{user.name}
					</option>
				))}
			</datalist>
		</form>
	);
}
