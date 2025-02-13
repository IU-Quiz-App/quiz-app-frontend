import { FC, useEffect, useState } from 'react';
import { getAllQuestions } from "@services/Api.ts";
import { Question } from "@services/Types.ts";
import Box from "@components/Box.tsx";
import QuestionTable from "@pages/question/QuestionTable.tsx";
import Button from "@components/Button.tsx";

export const FlyersTableWrapper: FC = () => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questions = await getAllQuestions();
                console.log('Fetched questions:', questions);
                setQuestions(questions);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Box>Loading...</Box>;
    }


    return (
        <Box className={'w-full flex-col gap-4'}>
            <div className={'flex flex-row justify-between w-full'}>
                <Button variant={'primary'} className={'w-fit h-fit'} route={'/dashboard'}>
                    Zurück
                </Button>

                <Button variant={'primary'} className={'w-fit h-fit whitespace-nowrap'} route={'/question/form'}>
                    Frage hinzufügen
                </Button>
            </div>
            <QuestionTable questions={questions} />
        </Box>
    );
};

export default FlyersTableWrapper;