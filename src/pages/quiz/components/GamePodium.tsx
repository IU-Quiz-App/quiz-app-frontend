import {GameSession, User, UserAnswer} from "@services/Types.ts";
import {useEffect, useState} from "react";
import Box from "@components/Box.tsx";

interface GamePodiumProps {
    gameSession: GameSession,
}

const GamePodium: React.FC<GamePodiumProps> = ({ gameSession }) => {

    const [ sortedUsers, setSortedUsers ] = useState(gameSession.users);
    const [ allUserAnswers, setAllUserAnswers ] = useState<UserAnswer[]>([]);

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


        const sorted = gameSession.users.map(user => {
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

    return (
        <Box className={'flex flex-col gap-4 !w-1/2 mx-auto'}>
            <div className={'flex flex-col gap-4'}>
                {sortedUsers.map(function (user, index) {
                    return (
                        <div key={index} className={'flex flex-row justify-between items-center'}>
                            <span className={'text-xl font-bold'}>{index + 1}. {user.nickname}</span>
                            <span className={'text-xl font-bold'}>{user.score} Punkte</span>
                        </div>
                    )
                })}
            </div>
        </Box>
    )
}

export default GamePodium;