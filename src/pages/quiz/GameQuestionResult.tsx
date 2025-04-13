import {Question, User} from "@services/Types.ts";
import Box from "@components/Box.tsx";
import {FC, useEffect, useState} from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {useMsal} from "@azure/msal-react";
import GameQuestionAnswer from "@pages/quiz/components/GameQuestionAnswer.tsx";

interface GameQuestionResultProps {
    users: User[];
    question: Question;

}

const GameQuestionResult: FC<GameQuestionResultProps> = ({ users, question }) => {
    const [open, setOpen] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [userUUID, setUserUUID] = useState<string | undefined>(undefined);

    const { instance } = useMsal();

    useEffect(() => {
        const userUUID = instance.getActiveAccount()?.localAccountId;
        setUserUUID(userUUID);
        const correctAnswer = question.answers.find(answer => answer.isTrue);
        const isCorrect = correctAnswer?.user_answers?.some(userAnswer => userAnswer.user_uuid === userUUID);
        setIsCorrect(isCorrect || false);
    }, [question]);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <Box className={`flex flex-col gap-4 !p-0 !w-full`} color={isCorrect ? 'green' : 'red'}>
            <div className={`flex flex-row justify-between p-4`} onClick={toggleOpen}>
                <span className={'font-bold text-xl'}>{question.text}</span>
                <ChevronDownIcon className={`w-6 h-6 ${ open ? '' : 'transform -rotate-90' }`}/>
            </div>
            {open ? (
                <div className={'flex flex-col w-full gap-4 p-4'} >
                    <div className={'grid grid-cols-2 gap-4 h-full *:w-full *:h-28'}>
                        {question.answers.map(function (answerItem, index) {
                            const isGiven = answerItem.user_answers?.some(userAnswer => userAnswer.user_uuid === userUUID);

                            return (
                                <GameQuestionAnswer
                                    answer={answerItem}
                                    step={'question-result'}
                                    key={index}
                                    isGiven={isGiven}
                                />
                            )
                        })}
                    </div>
                    {question.timed_out_answers?.some(answer => answer.user_uuid === userUUID) ? (
                            <div>
                                <span className={'text-red-500'}>Du hast die Frage nicht rechtzeitig beantwortet.</span>
                            </div>
                    ) : null}
                </div>
            ) : null}
        </Box>
    )

}

export default GameQuestionResult;