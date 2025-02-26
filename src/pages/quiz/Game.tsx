import StartGame from "@pages/quiz/StartGame.tsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {GameSession} from "@services/Types.ts";
import {getGameSession} from "@services/Api.ts";


const Game: React.FC = () => {
    const { uuid: uuid } = useParams();
    const [gameSession, setGameSession] = useState<GameSession | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        console.log('Game started with uuid:', uuid);

        async function fetchGameSession() {
            if (!uuid) {
                console.error('Cannot start game without uuid');
                navigate('/dashboard');
                return;
            }
            const gameSession = await getGameSession(uuid);
            setGameSession(gameSession);
        }

        fetchGameSession()
            .catch((error) => console.error('Error fetching game session', error));
    }, [uuid]);

    if (!gameSession) {
        return <div>Loading...</div>
    }

    return (
        <StartGame gameSession={gameSession}/>
    )
}

export default Game;