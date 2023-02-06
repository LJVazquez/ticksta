import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import UsersTable from '../components/UsersTable';
import { fetchAllUsers } from '../services/users';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import usePagination from '../hooks/usePagination';
import UsersPageHeader from '../components/UsersPageHeader';

export default function Users() {
	const [users, setUsers] = useState();
	const [searchKeywords, setSearchKeywords] = useState('');
	const [ticketStatusFilter, setUserStatusFilter] = useState('ALL');
	const { authToken } = useContext(AuthContext);

	const filterUsers = () => {
		const filteredByStatus = users?.filter(
			(user) => user.role === ticketStatusFilter || ticketStatusFilter === 'ALL'
		);

		const filteredByKeywords = filteredByStatus?.filter((user) => {
			return (
				user.email.toLowerCase().includes(searchKeywords.toLowerCase()) ||
				user.name.toLowerCase().includes(searchKeywords.toLowerCase())
			);
		});

		return filteredByKeywords;
	};

	const filteredUsers = filterUsers();

	const [paginatedUsers, PaginationButtons] = usePagination(filteredUsers, 10);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const users = await fetchAllUsers(authToken);
				setUsers(users);
			} catch (e) {
				handleError(e);
			}
		};

		fetchUsers();
	}, []);

	return (
		<Layout>
			<div className="bg-white p-3 p-md-5 rounded-4 shadow-sm">
				<UsersPageHeader
					searchValue={searchKeywords}
					setSearchValue={setSearchKeywords}
					selectValue={ticketStatusFilter}
					setSelectValue={setUserStatusFilter}
				/>
				<UsersTable users={paginatedUsers} setUsers={setUsers}></UsersTable>
				<PaginationButtons />
			</div>
		</Layout>
	);
}
