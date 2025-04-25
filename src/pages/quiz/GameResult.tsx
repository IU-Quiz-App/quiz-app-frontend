import {GameSession, User, UserAnswer} from "@services/Types.ts";
import Button from "@components/Button.tsx";
import GameQuestionResult from "./GameQuestionResult";
import Box from "@components/Box.tsx";
import React, {useEffect, useState} from "react";
import GamePodium from "@pages/quiz/components/GamePodium.tsx";
import Loader from "@components/Loader.tsx";

interface GameResultProps {
    gameSession: GameSession,
}

const GameResult: React.FC<GameResultProps> = ({ gameSession }) => {
    const [ sortedUsers, setSortedUsers ] = useState<User[]|null>(null);
    const [ allUserAnswers, setAllUserAnswers ] = useState<UserAnswer[]>([]);
    const [ showPodium, setShowPodium ] = useState<boolean>(false);

    useEffect(() => {
        const allAnswers: UserAnswer[] = [];
        gameSession.questions?.forEach(question => {
            question.answers.forEach(answer => {
                if (answer.user_answers) {
                    answer.user_answers.forEach(userAnswer => {
                        allAnswers.push(userAnswer);
                    });
                }
            });
            if (question.timed_out_answers) {
                question.timed_out_answers.forEach(userAnswer => {
                    allAnswers.push(userAnswer);
                });
            }
        });
        setAllUserAnswers(allAnswers);


        const sorted = gameSession.users
            .map(user => {
                return {
                    ...user,
                    score: getScore(user)
                }
            })
            .sort((a, b) => {
                if (a.score === b.score) {
                    return a.nickname.localeCompare(b.nickname);
                }
                return b.score - a.score;
            });

        setSortedUsers(sorted);

        setTimeout(() => {
            setShowPodium(true);
        }, 1000);
    }, [gameSession]);

    function getScore(user: User): number {
        let score = 0;

        allUserAnswers.filter(userAnswer => {
            return userAnswer.user_uuid === user.user_uuid;
        })
            .forEach(userAnswer => {
                if (userAnswer.score) {
                    score += userAnswer.score;
                }
            });

        return score;
    }

    if (!gameSession.questions) {
        return (
            <div>
                <h2>No questions found</h2>
            </div>
        )
    }

    if (!sortedUsers) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'}/>
            </div>
        )
    }

    return (
        <div className={'flex flex-col items-center gap-4'}>

            <GamePodium users={sortedUsers} className={'w-96 h-96'} startAnimation={showPodium} />
            <Box className={'flex flex-col gap-4 !w-1/2 mx-auto'}>
                <div className={'flex flex-col gap-4'}>
                    {sortedUsers && sortedUsers.map(function (user, index) {
                        return (
                            <div key={index}
                                 style={{
                                        transitionDelay: `${(index * 0.1) + 11}s`,
                                 }}
                                 className={`${showPodium ? 'opacity-100' : 'opacity-0'} flex flex-row justify-between transition-all duration-500 items-center`}
                            >
                                <span className={'text-xl font-bold'}>{index + 1}. {user.nickname}</span>
                                <span className={'text-xl font-bold'}>{user.score} Punkte</span>
                            </div>
                        )
                    })}
                </div>
            </Box>
            {gameSession.questions.map(function (question, index) {
                return (
                    <GameQuestionResult
                        key={index}
                        users={gameSession.users}
                        question={question}
                    />
                )
            })}
            <div className={'flex flex-row flex-end gap-4'}>
                <Button variant={'primary'} route={'/dashboard'}>
                    zum Dashboard
                </Button>
            </div>
        </div>
    )

}

export default GameResult;