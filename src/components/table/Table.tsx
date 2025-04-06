import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {useReactTable, getCoreRowModel, flexRender, ColumnDef} from "@tanstack/react-table";
import Pagination from "@components/table/Paginator.tsx";

interface TableProps<T> {
    queryKey: string;
    fetchData: (page: number) => Promise<T[]>;
    columns: ColumnDef<T>[];
}

const Table = <T,>({
                                   queryKey,
                                   fetchData,
                                   columns,
}: TableProps<T>) => {

    const [page, setPage] = useState(1);

    const { data = [], isLoading } = useQuery({
        queryKey: [queryKey, page],
        queryFn: () => fetchData(page),
        staleTime: 1000 * 60 * 5,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                        key={headerGroup.id}
                        className={`*:uppercase border-b *:text-sm *:whitespace-nowrap *:px-3 *:py-1.5 *:text-left *:font-semibold`}
                    >
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                            ))}
                    </tr>
                ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                    <tr
                        key={row.id}
                        className={`border-b border-gray-200 *:text-left *:text-sm *:whitespace-nowrap *:px-1.5 *:py-2`}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                setPage={setPage}
                currentPage={page}
                totalPages={2}
            />
        </div>
    );
}

export default Table;