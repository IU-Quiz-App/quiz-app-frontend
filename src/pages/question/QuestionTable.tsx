import Table from '@components/table/Table';
import {Course, Question} from "@services/Types.ts";
import {FC, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {deleteQuestion, getAllCourses} from "@services/Api.ts";

interface QuestionTableProps {
    fetchQuestions: (page: number, pageSize: number) => Promise<{items: Question[], total: number}>;
}

const QuestionTable: FC<QuestionTableProps> = ({ fetchQuestions }) => {

    const navigate = useNavigate();
    const tableRef = useRef<{ refetch: () => void }>(null);

    const [allCourses, setAllCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllCourses();
                setAllCourses(courses);
            } catch (error) {
                console.error('Error fetching courses', error);
            }
        };

        fetchCourses();
    }, []);

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
                { header: 'Kurs', cell: ({ row }) => {
                    const course = allCourses.find(course => course.uuid === (row.original as Question).course);
                    return course ? course.name + ' - ' + course.description : 'Unbekannt' + ' (' + (row.original as Question).course + ')';
                }},
                { accessorKey: 'text', header: 'Text' },
                { header: 'Aktion', cell: ({ row }) => renderActions(row.original as Question) },
            ]}
        />
    );
}

export default QuestionTable;