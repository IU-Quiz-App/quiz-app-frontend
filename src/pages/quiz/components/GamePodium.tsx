import {GameSession, User} from "@services/Types.ts";
import {useEffect, useState} from "react";
import Box from "@components/Box.tsx";

interface GamePodiumProps {
    gameSession: GameSession,
}

const GamePodium: React.FC<GamePodiumProps> = ({ gameSession }) => {

    const [ sortedUsers, setSortedUsers ] = useState(gameSession.users);

    useEffect(() => {
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
        gameSession.questions?.forEach((question) => {
            const correctAnswer = question.answers.filter(answer => answer.isTrue)[0];

            if (correctAnswer.user_answers?.some(userAnswer => userAnswer.user_uuid === user.user_uuid)) {
                score++;
            }
        });

        return score;
    }

    return (
        <Box className={'flex flex-col gap-4 w-1/2 mx-auto'}>
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