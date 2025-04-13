import Table from '@components/table/Table';
import { Question } from "@services/Types.ts";
import { FC, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteQuestion } from "@services/Api.ts";

interface QuestionTableProps {
    fetchQuestions: (page: number, pageSize: number) => Promise<{items: Question[], total: number}>;
}

const QuestionTable: FC<QuestionTableProps> = ({ fetchQuestions }) => {

    const navigate = useNavigate();
    const tableRef = useRef<{ refetch: () => void }>(null);

    const handleDelete = (question: Question) => {
        const uuid = question.uuid;
        const course = question.course;

        deleteQuestion(uuid, course)
            .then(() => {
                        tableRef.current?.refetch();

                console.log('Question deleted');
            });
    }

    const renderActions = (question: Question) => {
        return (
            <div className="flex space-x-2">
                <PencilSquareIcon
                    className={'cursor-pointer text-primary-3 w-5 h-5'}
                    onClick={() => navigate(`/question/form/${question.uuid}`)}
                />
                <TrashIcon
                    className={'cursor-pointer text-red-500 w-5 h-5'}
                    onClick={() => handleDelete(question)}
                />
            </div>
        )
    }

    return (
        <Table
            queryKey={'questions'}
            fetchData={fetchQuestions}
            ref={tableRef}
            columns={[
                { accessorKey: 'uuid', header: 'UUID' },
                { accessorKey: 'text', header: 'Text' },
                { header: 'Aktion', cell: ({ row }) => renderActions(row.original as Question) },
            ]}
        />
    );
}

export default QuestionTable;