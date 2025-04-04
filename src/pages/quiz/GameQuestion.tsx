import Box from "../../components/Box.tsx";
import Button from "../../components/Button.tsx";
import {useEffect, useState} from "react";
import {Answer, Question} from "@services/Types.ts";
import GameTimer from "@pages/quiz/GameTimer.tsx";
import GameProgressBar from "@pages/quiz/GameProgressBar.tsx";
import GameCountdown from "@pages/quiz/GameCountdown.tsx";

interface QuestionProps {
    question: Question,
    answerQuestion: (answer: Answer) => void,
    seconds?: number
    step: 'next-question' | 'waiting-for-result' | 'question-result',
}

const GameQuestion: React.FC<QuestionProps> = ({ question, answerQuestion, seconds, step }) => {

    const[answer, setAnswer] = useState<Answer|null>(null);
    const[questionUUID, setQuestionUUID] = useState<string|undefined>(undefined);

    useEffect(() => {
        if (questionUUID !== question.uuid) {
            setAnswer(null);
            setQuestionUUID(question.uuid);
        }
    }, [question]);

    async function handleOnClick(newAnswer: Answer) {
        if (answer || step !== 'next-question') {
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

        if (step === 'question-result') {
            attributes.disabled = true;

            if (answerItem.isTrue) {
                attributes.color = 'green';
            }

            if (answer?.uuid === answerItem.uuid && !answerItem.isTrue) {
                attributes.color = 'red';
            }
        }

        if (step !== 'next-question') {
            attributes.disabled = true;
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
        <div className={`flex flex-col w-full h-full gap-6`}>
            <div className={`flex flex-row gap-4 w-full justify-center`}>
                <div className={`w-64`}>

                </div>
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
                    <div className={`w-full flex flex-col items-center justify-center`}>
                        {step === 'question-result' && seconds &&
                            <div className="flex flex-col w-full">
                                <GameProgressBar start={true} seconds={seconds} height={5} width={100} />
                            </div>
                        }
                        {step === 'waiting-for-result' && seconds &&
                            <div className="flex flex-col w-full h-10">
                                <GameCountdown start={true} seconds={seconds} />
                            </div>
                        }
                    </div>
                </div>
                <div className={`w-64`}>
                    {step === 'next-question' && seconds &&
                        <GameTimer start={true} seconds={seconds} />
                    }
                </div>
            </div>
        </div>
    )

}

export default GameQuestion;