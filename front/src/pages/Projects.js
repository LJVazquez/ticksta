import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';
import { fetchAllProjects } from '../services/projects';
import { AuthContext } from '../context/AuthContext';
import useHandleAxiosError from '../hooks/useHandleAxiosError';
import usePagination from '../hooks/usePagination';
import ProjectsPageHeader from '../components/ProjectsPageHeader';

export default function Projects() {
	const [projects, setProjects] = useState();
	const [searchKeywords, setSearchKeywords] = useState('');
	const { authToken } = useContext(AuthContext);

	const filterProjects = () => {
		const filteredByKeywords = projects?.filter((project) => {
			return project.name.toLowerCase().includes(searchKeywords.toLowerCase());
		});

		return filteredByKeywords;
	};

	const filteredProjects = filterProjects();

	const [paginatedProjects, PaginationButtons] = usePagination(
		filteredProjects,
		10
	);

	const handleError = useHandleAxiosError();

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const projects = await fetchAllProjects(authToken);
				setProjects(projects);
			} catch (e) {
				handleError(e);
			}
		};

		fetchProjects();
	}, []);

	return (
		<Layout>
			<div className="bg-white p-3 p-md-5 rounded-4 shadow-sm">
				<ProjectsPageHeader
					searchValue={searchKeywords}
					setSearchValue={setSearchKeywords}
				/>
				<ProjectsTable projects={paginatedProjects} />
				<PaginationButtons />
			</div>
		</Layout>
	);
}
