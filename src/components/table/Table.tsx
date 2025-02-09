import { MagnifyingGlassIcon } from '@heroicons/react/24/outline/index';
import {useEffect, useState} from 'react';
import Pagination from './Paginator.tsx';
import React from 'react';
import { resolveNestedValue } from '../../services/Utils.ts';
import {
    ChevronDownIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/20/solid/index';
import CheckBox from '../input/CheckBox';
import Loader from "../Loader.tsx";
import {Item} from "../../services/Types.ts";

interface TableColumn<T extends Item> {
    key: string;
    label?: string;
    filterable?: boolean;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode | string | number;
    className?: string;
    headerClassName?: string;
    searchable?: boolean;
    customValue?: (item: Item) => string;
}

interface TableProps<T extends Item> {
    data: T[];
    checkboxes?: boolean;
    selectedItem?: number | string | null;
    selectedItems?: string[];
    handleCheckboxChange?: (uuid: string) => void;
    multiselect?: boolean;
    withSearch?: boolean;
    itemsPerPage?: number;
    withIndex?: boolean;
    tableColumns: TableColumn<T>[];
}

const Table = <T extends Item>({
                                   data,
                                   checkboxes,
                                   selectedItem,
                                   selectedItems,
                                   handleCheckboxChange,
                                   multiselect,
                                   withSearch,
                                   itemsPerPage = 10,
                                   withIndex = false,
                                   tableColumns,
}: TableProps<T>) => {

    const [columns] = useState(tableColumns);
    const [columnKeys] = useState(tableColumns.map((col) => col.key));
    const [searchableColumns] = useState(
        tableColumns.filter((col) => col.searchable).map((col) => col)
    );

    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filteredData, setFilteredData] = useState<T[]>([]);
    const [sortedData, setSortedData] = useState<T[]>([]);
    const [paginatedData, setPaginatedData] = useState<T[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setFilteredData(
            data.filter((item) => {
                if (search.trim() === '') {
                    return true;
                }

                return searchableColumns.some((column) => {
                    const columnValue = column.customValue
                        ? column.customValue(item)
                        : resolveNestedValue(item, column.key);

                    return (
                        columnValue &&
                        columnValue.toString().toLowerCase().includes(search.toLowerCase())
                    );
                });
            })
        );
    }, [data, search, searchableColumns]);

    useEffect(() => {
        setSortedData(
            [...filteredData].sort((a, b) => {
                const aColumn = columns.find((col) => col.key === sortBy);
                const bColumn = columns.find((col) => col.key === sortBy);

                const aValue = aColumn?.customValue
                    ? aColumn.customValue(a)
                    : resolveNestedValue(a, sortBy);
                const bValue = bColumn?.customValue
                    ? bColumn.customValue(b)
                    : resolveNestedValue(b, sortBy);

                if (aValue < bValue) {
                    return sortDirection === 'asc' ? -1 : 1;
                } else if (aValue > bValue) {
                    return sortDirection === 'asc' ? 1 : -1;
                } else {
                    return 0;
                }
            })
        );
    }, [filteredData, sortBy, sortDirection, columns]);

    useEffect(() => {
        setPaginatedData(
            sortedData.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            )
        );
    }, [sortedData, currentPage, itemsPerPage]);

    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage !== Math.ceil(data.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    if (!data || !columnKeys.length) {
        return <Loader />;
    }

    const handleSort = (column: TableColumn<T>) => {
        if (!column.sortable) {
            return;
        }

        if (sortBy === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column.key);
            setSortDirection('asc');
        }
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div
            className={`flex flex-col w-full`}
        >
            {withSearch && searchableColumns.length > 0 && (
                <div className="flex flex-row gap-4 w-full px-3 py-2 items-center border-b">
                    <MagnifyingGlassIcon className="h-5 w-5" strokeWidth="2" />
                    <label htmlFor="search" className="grow">
                        <input
                            id="search"
                            type="text"
                            placeholder="SUCHE"
                            className="rounded-lg border-none focus:ring-0 font-semibold text-sm"
                            onChange={handleSearch}
                        />
                    </label>
                </div>
            )}
            <div
                className={`w-full`}
            >
                <table className="w-full">
                    <thead>
                    <tr
                        className={`*:uppercase border-b *:text-sm *:whitespace-nowrap *:px-3 *:py-3.5 *:text-left *:font-semibold`}
                    >
                        {checkboxes && <th className=""></th>}
                        {withIndex && <th className=""></th>}
                        {columns.map((column, index) => (
                            <th key={index}>
                                <div
                                    className={`flex flex-row items-center justify-start ${column.headerClassName}`}
                                    onClick={() => handleSort(column)}
                                >
                                    <span>{column.label}</span>
                                    {column.sortable && (
                                        <div className="w-3 h-4">
                                            {sortBy === column.key ? (
                                                sortDirection === 'asc' ? (
                                                    <ChevronUpIcon className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDownIcon className="w-4 h-4" />
                                                )
                                            ) : (
                                                <ChevronUpDownIcon className="w-4 h-4" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    columnKeys.length +
                                    (checkboxes ? 1 : 0) +
                                    (withIndex ? 1 : 0)
                                }
                                className="text-center p-4"
                            >
                                Keine Einträge gefunden
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((item, index) => (
                            <tr
                                key={index}
                                className={`
                  border-b border-gray-200 *:text-left *:text-sm *:whitespace-nowrap *:px-3 *:py-4`}
                                onClick={() => item.uuid && handleCheckboxChange?.(item.uuid)}
                            >
                                {checkboxes && (
                                    <td className="w-5" key={'checkbox'}>
                                        <CheckBox
                                            id={`table-checkbox-${item.uuid}`}
                                            name={`table-checkbox-${item.uuid}`}
                                            checked={
                                                multiselect
                                                    ? !!item.uuid && selectedItems?.includes(item.uuid)
                                                    : selectedItem === item.uuid
                                            }
                                            onChange={() => item.uuid && handleCheckboxChange?.(item.uuid)}
                                        />
                                    </td>
                                )}
                                {withIndex && (
                                    <td className="w-16" key={'index'}>
                                        {index + 1 + itemsPerPage * (currentPage - 1)}
                                    </td>
                                )}
                                {columnKeys.map((key, colIndex) => {
                                    const column = columns[colIndex];
                                    if (column.render) {
                                        return (
                                            <td key={colIndex} className={column.className ?? ''}>
                                                {column.render(item)}
                                            </td>
                                        );
                                    } else if (column.customValue) {
                                        const value = column.customValue(item);
                                        return (
                                            <td key={colIndex} className={column.className ?? ''}>
                                                {value}
                                            </td>
                                        );
                                    } else {
                                        const value = resolveNestedValue(item, key);
                                        return (
                                            <td key={colIndex} className={column.className ?? ''}>
                                                {value}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                paginate={paginate}
                previousPage={previousPage}
                nextPage={nextPage}
                currentPage={currentPage}
            />
        </div>
    );
};

export default Table;