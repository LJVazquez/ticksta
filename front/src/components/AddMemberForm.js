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
	const [selectedMemberEmail, setSelectedMemberEmail] = useState('');
	const [error, setError] = useState(null);
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

		const userIsAssignable = assignableUsers.some(
			(assignableUser) => assignableUser.email === selectedMemberEmail
		);

		if (!userIsAssignable) {
			setError('No se encontró al usuario');
			return;
		}

		addMember(selectedMemberEmail);

		const usersLeft = assignableUsers.filter(
			(assignableUser) => assignableUser.email !== selectedMemberEmail
		);
		setAssignableUsers(usersLeft);

		setSelectedMemberEmail('');
		onUserAssignment();
	};

	return (
		<form
			className="bg-light p-3 mx-3 rounded-4 mb-3"
			onSubmit={(e) => handleSubmit(e)}
		>
			<p>Asignar al equipo</p>
			<div className="input-group">
				<input
					value={selectedMemberEmail}
					onChange={(e) => setSelectedMemberEmail(e.target.value)}
					type="text"
					className="form-control rounded-3 rounded-end"
					list="members"
					autoComplete="off"
				/>
				<button className="btn btn-dark rounded-3 rounded-start">
					Asignar
				</button>
			</div>
			{error && <small className="text-danger">{error}</small>}

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
