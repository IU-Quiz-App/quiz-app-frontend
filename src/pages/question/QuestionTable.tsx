import Box from '@components/Box.tsx';
import Table from '@components/table/Table';
import { Question } from "@services/Types.ts";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";


interface QuestionTableProps {
    questions: Question[];
}

const QuestionTable: FC<QuestionTableProps> = ({ questions }) => {

    const navigate = useNavigate();

    if (questions.length === 0) {
        return <Box>Loading...</Box>
    }

    const renderActions = (question: Question) => {
        return (
            <PencilSquareIcon
                className={'cursor-pointer text-primary-3 w-5 h-5'}
                onClick={() => navigate(`/question/form/${question.uuid}`)}
            />
        )
    }

    return (
        <Table
            data={questions}
            tableColumns={[
                { key: 'uuid', label: 'UUID' },
                { key: 'text', label: 'Text' },
                { key: 'actions', label: 'Aktion', render: renderActions }
            ]}
        />
    );
}

export default QuestionTable;