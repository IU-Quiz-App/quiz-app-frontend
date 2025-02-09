import { Link } from 'react-router-dom';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline/index';
import { FC } from 'react';

interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    paginate: (pageNumber: number) => void;
    previousPage: () => void;
    nextPage: () => void;
    currentPage: number;
}

const Pagination: FC<PaginationProps> = ({
                                             itemsPerPage,
                                             totalItems,
                                             paginate,
                                             previousPage,
                                             nextPage,
                                             currentPage,
                                         }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 5;
    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const middlePage = Math.floor(maxPagesToShow / 2);
        if (currentPage <= middlePage) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + middlePage >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - middlePage;
            endPage = currentPage + middlePage;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumber = (number: number) => (
        <Link
            to="#"
            key={number}
            onClick={() => paginate(number)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium hover:border-gray-300 hover:text-gray-700 ${
                currentPage === number
                    ? 'border-primary-3 text-primary-3'
                    : 'border-transparent text-gray-500'
            }`}
        >
            {number}
        </Link>
    );

    if (totalItems <= itemsPerPage) {
        return null;
    }

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 pb-4">
            <div className="-mt-px flex w-0 flex-1">
                {currentPage > 1 ? (
                    <Link
                        to="#"
                        onClick={previousPage}
                        className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        <ChevronLeftIcon
                            className="mr-3 h-3 w-3 text-primary-2"
                            strokeWidth="6"
                            aria-hidden="true"
                        />
                        Zurück
                    </Link>
                ) : null}
            </div>
            <ul className="hidden md:-mt-px md:flex">
                {startPage > 1 && (
                    <>
                        {renderPageNumber(1)}
                        {startPage > 2 && <span className="px-2 pt-4">...</span>}
                    </>
                )}
                {pageNumbers.map(renderPageNumber)}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 pt-4">...</span>}
                        {renderPageNumber(totalPages)}
                    </>
                )}
            </ul>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                {currentPage < totalPages ? (
                    <Link
                        to="#"
                        onClick={nextPage}
                        className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        Vorwärts
                        <ChevronRightIcon
                            className="ml-3 h-3 w-3 text-primary-2"
                            strokeWidth="6"
                            aria-hidden="true"
                        />
                    </Link>
                ) : null}
            </div>
        </nav>
    );
};

export default Pagination;