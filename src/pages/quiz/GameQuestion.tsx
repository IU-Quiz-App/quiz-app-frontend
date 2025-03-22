import Box from "../../components/Box.tsx";
import Button from "../../components/Button.tsx";
import {useEffect, useState} from "react";
import {Answer, Question} from "@services/Types.ts";

interface QuestionProps {
    question: Question,
    correctAnswer: Answer|null,
    answerQuestion: (answer: Answer) => void,
}

const GameQuestion: React.FC<QuestionProps> = ({ question, correctAnswer, answerQuestion }) => {

    const[answer, setAnswer] = useState<Answer|null>(null);

    useEffect(() => {
        setAnswer(null);
    }, [question]);

    async function handleOnClick(newAnswer: Answer) {
        if (correctAnswer) {
            return;
        }

        console.log('Answer question', newAnswer);

        setAnswer(newAnswer);
        answerQuestion(newAnswer);
    }

    const AnswerButton = (answerItem: Answer, index: number) => {
        const attributes = {
            variant: answer?.uuid === answerItem.uuid ? 'primary' : 'tertiary',
        } as any;

        if (answer && correctAnswer && answerItem.uuid === answer.uuid) {
            attributes.color = correctAnswer.uuid === answerItem.uuid ? 'green' : 'red';
        }

        return(
            <Button
                key={index}
                onClick={() => handleOnClick(answerItem)}
                {...attributes}
            >
                {answerItem.text}
            </Button>
        )
    };

    return (
        <div className={'flex flex-col gap-4 w-full justify-center items-center'}>
            <div className={'w-2/3 flex flex-col gap-4'}>
                <Box className={'w-full h-24'}>
                    <span>{question.text}</span>
                </Box>
                <div className={'flex flex-col w-full gap-4'}>
                    <div className={'grid grid-cols-2 gap-4 h-full *:w-full *:h-28'}>
                        {question.answers.map((answerItem, index) => (
                            AnswerButton(answerItem, index)
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default GameQuestion;