import { useState } from 'react';
import Pagination from '../components/Pagination';

export default function usePagination(resources, resourcesPerPage) {
	const [currentPage, setCurrentPage] = useState(1);

	const lastResourceIndex = currentPage * resourcesPerPage;
	const firstResourceIndex = lastResourceIndex - resourcesPerPage;

	const pages = [];

	for (let i = 1; i <= Math.ceil(resources?.length / resourcesPerPage); i++) {
		pages.push(i);
	}

	const paginatedResources = resources?.slice(
		firstResourceIndex,
		lastResourceIndex
	);

	const goToNextPage = () => {
		if (currentPage < pages[pages.length - 1]) {
			setCurrentPage((prevValue) => prevValue + 1);
		}
	};

	const goToPrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prevValue) => prevValue - 1);
		}
	};

	const PaginationButtons = () => {
		return pages.length > 1 ? (
			<Pagination
				pages={pages}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				goToNextPage={goToNextPage}
				goToPrevPage={goToPrevPage}
			/>
		) : (
			''
		);
	};

	return [paginatedResources, PaginationButtons];
}
