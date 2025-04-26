import Box from "../../components/Box.tsx";
import {useEffect, useState} from "react";
import {Answer, Question, User} from "@services/Types.ts";
import GameTimer from "@pages/quiz/components/GameTimer.tsx";
import GameProgressBar from "@pages/quiz/components/GameProgressBar.tsx";
import GameCountdown from "@pages/quiz/components/GameCountdown.tsx";
import GameQuestionAnswer from "@pages/quiz/components/GameQuestionAnswer.tsx";

interface QuestionProps {
    question: Question,
    answerQuestion?: (answer: Answer) => void,
    seconds?: number
    step: 'next-question' | 'waiting-for-result' | 'question-result',
    users: User[]
}

const GameQuestion: React.FC<QuestionProps> = ({ question, answerQuestion, seconds, step, users }) => {

    const[answer, setAnswer] = useState<Answer|null>(null);
    const[questionUUID, setQuestionUUID] = useState<string|undefined>(undefined);

    useEffect(() => {
        if (questionUUID !== question.uuid) {
            setAnswer(null);
            setQuestionUUID(question.uuid);
        }
    }, [question]);

    useEffect(() => {
        if (step === 'question-result' && seconds) {
            setAnswer(null);
        }
    }, [step]);

    async function handleOnClick(newAnswer: Answer) {
        if (answer || step !== 'next-question') {
            return;
        }

        console.log('Answer question', newAnswer);

        setAnswer(newAnswer);
        if (answerQuestion) {
            answerQuestion(newAnswer);
        }
    }

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
                                 <GameQuestionAnswer
                                     users={users}
                                     answer={answerItem}
                                     step={step}
                                     onClick={handleOnClick}
                                     key={index}
                                     isGiven={answerItem.uuid === answer?.uuid}
                                />
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