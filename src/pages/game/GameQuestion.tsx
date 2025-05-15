import Box from "../../components/Box.tsx";
import {useContext, useEffect, useState} from "react";
import {Answer, Question, User} from "@services/Types.ts";
import Timer from "@components/Timer.tsx";
import ProgressBar from "@components/ProgressBar.tsx";
import Countdown from "@components/Countdown.tsx";
import GameQuestionAnswer from "@pages/game/GameQuestionAnswer.tsx";
import {AuthContext} from "../../auth/hooks/AuthProvider.tsx";
import confetti from 'canvas-confetti';

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

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (questionUUID !== question.uuid) {
            setAnswer(null);
            setQuestionUUID(question.uuid);
        }
    }, [question]);

    useEffect(() => {
        if (step === 'question-result' && seconds) {
            setAnswer(null);

            const correct_answer = question.answers.find(answer => answer.isTrue);

            if (!correct_answer) {
                console.error('No correct answer found');
                return;
            }

            const correct_answer_user = correct_answer.user_answers ?? [];

            if (correct_answer_user.some(userAnswer => userAnswer.user_uuid === user?.user_uuid)) {
                const element = document.getElementById(`quiz-question-answer-${correct_answer.uuid}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;

                    const confettiOptions = {
                        particleCount: 25,
                        colors: ['#0a0', '#0f0', '#090'],
                        opacity: 0.1,
                        startVelocity: 10,
                        gravity: 0,
                        spread: 90,
                        decay: 0.9,
                        ticks: 30,
                        origin: {
                            x: x / window.innerWidth,
                            y: y / window.innerHeight,
                        },
                    }

                    confetti({
                        ...confettiOptions,
                        angle: 0,
                    });
                    confetti({
                        ...confettiOptions,
                        angle: 180,
                    });
                }
            }
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
                                     id={`quiz-question-answer-${answerItem.uuid}`}
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
                                <ProgressBar start={true} seconds={seconds} height={5} width={100} />
                            </div>
                        }
                        {step === 'waiting-for-result' && seconds &&
                            <div className="flex flex-col w-full h-10">
                                <Countdown start={true} seconds={seconds} />
                            </div>
                        }
                    </div>
                </div>
                <div className={`w-64`}>
                    {step === 'next-question' && seconds &&
                        <Timer start={true} seconds={seconds} />
                    }
                </div>
            </div>
        </div>
    )

}

export default GameQuestion;