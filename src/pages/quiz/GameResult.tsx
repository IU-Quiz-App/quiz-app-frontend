import {GameSession, User} from "@services/Types.ts";
import React, {useEffect, useState} from "react";
import {getUser} from "@services/Api.ts";
import Loader from "@components/Loader.tsx";
import GameResultUser from "@pages/quiz/GameResultUser.tsx";
import Button from "@components/Button.tsx";

interface GameResultProps {
    gameSession: GameSession,
}

const GameResult: React.FC<GameResultProps> = ({ gameSession }) => {

    const [users, setUsers] = useState<User[]|null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchUsers() {
            if (!gameSession.users) {
                return;
            }



            setUsers(gameSession.users);
        }

        async function fetchUser() {
            const user = await getUser();

            setUser(user);
        }

        fetchUsers()
            .then(() => {
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching users', error));

        fetchUser()
            .then(() => {
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching user', error));

    }, [gameSession]);


    if (loading) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'}/>
            </div>
        )
    }

    if (!gameSession.questions) {
        return (
            <div>
                <h2>No questions found</h2>
            </div>
        )
    }

    if (!gameSession.users_answers) {
        return (
            <div>
                <h2>No user answers found</h2>
            </div>
        )
    }

    return (
        <div className={'flex flex-col gap-4'}>‚
            {users ?
                users.sort((a) => a.user_uuid === user?.user_uuid ? -1 : 1).map((userItem, index) => {
                    return (
                        <GameResultUser open={userItem.user_uuid === user?.user_uuid} user={userItem} questions={gameSession.questions} usersAnswers={gameSession.users_answers.filter(userAnswer => userAnswer.user_uuid === userItem.user_uuid)} key={index}/>
                    )
                })
            :
                <div>
                    No users found
                </div>
            }
            <div className={'flex flex-row flex-end gap-4'}>
                <Button variant={'primary'} route={'/dashboard'}>
                    zum Dashboard
                </Button>
            </div>
        </div>
    )

}

export default GameResult;