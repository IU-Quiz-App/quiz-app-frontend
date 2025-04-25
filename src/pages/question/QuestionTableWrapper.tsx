import { FC } from 'react';
import Box from "@components/Box.tsx";
import Button from "@components/Button.tsx";
import QuestionsTable from "@pages/question/QuestionTable.tsx";
import {getAllQuestionsByUser} from "@services/Api.ts";

export const QuestionTableWrapper: FC = () => {

    return (
        <Box className={'w-full flex-col gap-4 min-h-full'}>
            <div className={'flex flex-row justify-between w-full'}>
                <Button variant={'primary'} className={'w-fit h-fit'} route={'/dashboard'}>
                    Zurück
                </Button>

                <Button variant={'primary'} className={'w-fit h-fit whitespace-nowrap'} route={'/question/form'}>
                    Frage hinzufügen
                </Button>
            </div>
            <QuestionsTable
                fetchQuestions={async (page, pageSize) => {
                    return await getAllQuestionsByUser(page, pageSize)
                }}
            />
        </Box>
    );
};

export default QuestionTableWrapper;