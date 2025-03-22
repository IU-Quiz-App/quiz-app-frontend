import GameForm from "@pages/quiz/GameForm.tsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameSession, Question } from "@services/Types.ts";
import { getGameSession, getNextQuestion } from "@services/Api.ts";
import GameQuestion from "@pages/quiz/GameQuestion.tsx";
import Loader from "@components/Loader.tsx";

import useWebSocket from "react-use-websocket";
import Config from "@services/Config.ts";
import GameResult from "@pages/quiz/GameResult.tsx";

const Game: React.FC = () => {
    const { uuid: uuid } = useParams();
    const [gameSession, setGameSession] = useState<GameSession | null>(
        JSON.parse(localStorage.getItem('game-session') as string) as GameSession || null
    );
    const [step, setStep] = useState<'start' | 'question' | 'end'>('start');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const { sendMessage, lastMessage } = useWebSocket(socketUrl ?? null, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onOpen: () => console.log("WebSocket connected"),
        onClose: () => console.log("WebSocket disconnected"),
    });

    useEffect(() => {
        if (lastMessage) {
            console.log("Message received:", lastMessage.data);
        }
    }, [lastMessage]);

    useEffect(() => {
        localStorage.setItem('game-session', JSON.stringify(gameSession) as string || '');
    }, [gameSession]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!uuid) {
            navigate("/dashboard");
            return;
        }

        async function fetchGameSession() {
            if (!uuid) {
                console.error('Cannot start game without uuid');
                navigate('/dashboard');
                return;
            }
            const gameSession = await getGameSession(uuid);

            return gameSession;
        }

        fetchGameSession()
            .then(gameSession => {
                if (!gameSession) {
                    console.error('Game session not found');
                    navigate('/dashboard');
                    return;
                }

                setGameSession(gameSession);
            })
            .catch((error) => {
                console.error('Error fetching game session', error)
                navigate('/dashboard');
            });

        console.log('Game session uuid:', uuid);
        setSocketUrl(Config.WebsocketURL);

        sendMessage(
            JSON.stringify({
                action: "update-websocket-information",
                session_uuid: uuid,
                user_uuid: "Philipp"
            })
        );
    }, [uuid]);

    if (!gameSession) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'} />
            </div>
        )
    }

    if (step === 'start') {
        return (
            <GameForm gameSession={gameSession}/>
        )
    }

    if (step === 'question' && currentQuestion) {
        return (
            <GameQuestion question={currentQuestion} gameSession={gameSession} nextQuestion={nextQuestion} />
        )
    }

    if (step === 'end') {
        return (
            <GameResult gameSession={gameSession}/>
        )
    }

    return (
        <div className={'w-full h-full flex items-center justify-center'}>
            <Loader className={'w-28'} />
        </div>
    )
}

export default Game;