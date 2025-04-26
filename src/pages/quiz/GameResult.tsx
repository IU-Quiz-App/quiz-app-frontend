import {GameSession, User, UserAnswer} from "@services/Types.ts";
import Button from "@components/Button.tsx";
import GameQuestionResult from "./GameQuestionResult";
import Box from "@components/Box.tsx";
import React, {useEffect, useState} from "react";
import GamePodium from "@pages/quiz/components/GamePodium.tsx";
import Loader from "@components/Loader.tsx";
import {delay} from "@services/Utils.ts";

interface GameResultProps {
    gameSession: GameSession,
    animationDuration?: number;
}

const GameResult: React.FC<GameResultProps> = ({ gameSession, animationDuration = 10 }) => {
    const [ sortedUsers, setSortedUsers ] = useState<User[]>([]);
    const [ showPodium, setShowPodium ] = useState<boolean>(false);
    const [ showSortedUsers, setShowSortedUsers ] = useState<boolean>(false);
    const [ showQuestionResults, setShowQuestionResults ] = useState<boolean>(false);

    useEffect(() => {
        if (gameSession && gameSession.users) {
            init();
        }
    }, [gameSession]);

    async function init() {
        console.log("second", animationDuration);
        const sortedUsers = sortUsers();
        await delay(1);
        setShowPodium(true);
        const waitTime = sortedUsers.length >=3 ? animationDuration : (animationDuration/3)*sortedUsers.length;
        await delay(waitTime);
        setShowSortedUsers(true);
        setShowQuestionResults(true);
    }

    function sortUsers() {
        const sorted = gameSession.users
            .map(user => {
                const score = getScore(user)

                return {
                    ...user,
                    score: score,
                }
            })
            .sort((a, b) => {
                if (a.score === b.score) {
                    return a.nickname.localeCompare(b.nickname);
                }
                return b.score - a.score;
            });

        setSortedUsers(sorted);
        return sorted;
    }

    function getScore(user: User): number {
        let score = 0;

        const userAnswers = collectUsersAnswers(user.user_uuid);

        userAnswers.forEach(userAnswer => {
            if (userAnswer.score) {
                score += userAnswer.score;
            }
        });

        return score;
    }

    function collectUsersAnswers(user_uuid: string) {
        const allAnswers: UserAnswer[] = [];

        gameSession.questions?.forEach(question => {
            question.answers.forEach(answer => {
                if (answer.user_answers) {
                    answer.user_answers.forEach(userAnswer => {
                        if (userAnswer.user_uuid === user_uuid) {
                            allAnswers.push(userAnswer);
                        }
                    });
                }
            });
            if (question.timed_out_answers) {
                question.timed_out_answers.forEach(userAnswer => {
                    if (userAnswer.user_uuid === user_uuid) {
                        allAnswers.push(userAnswer);
                    }
                });
            }
        });

        return allAnswers;
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
        <div className={'flex flex-col items-center gap-4 max-w-2xl w-full mx-auto'}>

            <GamePodium users={sortedUsers} className={'w-96 h-96'} startAnimation={showPodium} secondsPerStep={animationDuration/6 - 0.1} />
            <Box className={'flex flex-col gap-4 w-full'}>
                <div className={'flex flex-col gap-4'}>
                    {sortedUsers.map(function (user, index) {
                        return (
                            <div key={index}
                                 className={`${showSortedUsers ? 'opacity-100' : 'opacity-0'} flex flex-row justify-between transition-all duration-500 items-center`}
                            >
                                <span className={'text-xl font-bold'}>{index + 1}. {user.nickname}</span>
                                <span className={'text-xl font-bold'}>{user.score} Punkte</span>
                            </div>
                        )
                    })}
                </div>
            </Box>
                <div className={`flex w-full flex-col gap-4 ${showQuestionResults ? 'opacity-100' : 'opacity-0'} transition-all duration-500`}>
                    <div className={'text-white text-2xl font-bold'}>
                        Ergebnisse der Fragen:
                    </div>
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
        </div>
    )

}

export default GameResult;