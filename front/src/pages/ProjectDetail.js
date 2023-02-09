import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TicketsTable from '../components/TicketsTable';
import ProjectUsersTable from '../components/ProjectUsersTable';
import {
	addUserToProject,
	fetchProjectById,
	removeUserFromProject,
} from '../services/projects';
import { AuthContext } from '../context/AuthContext';

import useHandleAxiosError from '../hooks/useHandleAxiosError';
import ProjectDetailData from '../components/ProjectDetailData';
import usePagination from '../hooks/usePagination';

export default function ProjectDetail() {
	const [project, setProject] = useState();

	const { projectId } = useParams();
	const { authUser, authToken } = useContext(AuthContext);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchProjectData = async () => {
			try {
				const projectData = await fetchProjectById(
					parseInt(projectId),
					authToken
				);
				setProject(projectData);
			} catch (e) {
				handleError(e);
			}
		};
		fetchProjectData();
	}, []);

	const [paginatedTickets, PaginationButtons] = usePagination(
		project?.tickets,
		5
	);

	const addMember = async (userEmail) => {
		try {
			const updatedProject = await addUserToProject(
				parseInt(projectId),
				userEmail,
				authToken
			);
			setProject(updatedProject);
		} catch (e) {
			handleError(e);
		}
	};

	const removeMember = async (userEmail) => {
		try {
			const updatedProject = await removeUserFromProject(
				parseInt(projectId),
				userEmail,
				authToken
			);
			setProject(updatedProject);
		} catch (e) {
			handleError(e);
		}
	};

	return (
		<Layout>
			<ProjectDetailData project={project} setProject={setProject} />

			<div className="bg-white p-3 rounded-4 mb-3 shadow-sm mx-1">
				<h5>
					<i className="bi bi-ticket-fill text-warning me-2"></i>Tickets del
					proyecto
				</h5>
				{authUser.userRole === 'USER' && (
					<div>
						<Link
							to={`/projects/${projectId}/new-ticket`}
							className="btn btn-sm mb-3"
						>
							<i className="bi bi-plus-circle-fill"></i> Nuevo ticket
						</Link>
					</div>
				)}
				<TicketsTable tickets={paginatedTickets} />
				<PaginationButtons />
			</div>
			<ProjectUsersTable
				addMember={addMember}
				removeMember={removeMember}
				users={project?.assignedUsers}
			/>
		</Layout>
	);
}
