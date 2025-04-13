import {Question, User, UserAnswer} from "@services/Types.ts";
import Box from "@components/Box.tsx";
import {FC, useEffect, useState} from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/solid";

interface GameResultUser {
    user: User;
    questions: Question[];
    usersAnswers: UserAnswer[];
    open?: boolean;

}

const GameResultUser: FC<GameResultUser> = ({ user, questions, usersAnswers, open }) => {

    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    function toggleOpen() {
        setIsOpen(!isOpen);
    }

    return (
        <Box className={'flex flex-col gap-4 !w-full'}>
            <div className={'flex flex-row justify-between'} onClick={toggleOpen} >
                <span className={'font-bold text-xl'}>{user.nickname}'s Ergebnisse</span>
                <ChevronDownIcon className={`w-6 h-6 ${ isOpen ? '' : 'transform -rotate-90' }`}/>
            </div>
            {isOpen ? (
                <div className={'flex flex-col gap-2'}>
                    {questions.map((question, index) => {
                        const userAnswer = usersAnswers.find(userAnswer => userAnswer.question_uuid === question.uuid);
                        const isCorrect = userAnswer?.answer === userAnswer?.correct_answer;

                        return (
                            <div key={index} className={`flex flex-row justify-between p-2 rounded border ${isCorrect ? 'bg-green-200 border-green-700' : 'bg-red-200 border-red-700'}`}>
                                <div>{question.text}</div>
                                {isCorrect ? (
                                    <CheckIcon className={'h-6 w-6 stroke-2'}/>
                                    ) : (
                                    <XMarkIcon className={'h-6 w-6'}/>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : null}
        </Box>
    )

}

export default GameResultUser;