import GameForm from "@pages/quiz/GameForm.tsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameSession, Question } from "@services/Types.ts";
import { createSession, getGameSession, getNextQuestion, startGameSession } from "@services/Api.ts";
import GameQuestion from "@pages/quiz/GameQuestion.tsx";
import Loader from "@components/Loader.tsx";

import useWebSocket from "react-use-websocket";
import Config from "@services/Config.ts";

const Game: React.FC = () => {
    const { uuid: uuid } = useParams();
    const [gameSession, setGameSession] = useState<GameSession | null>(
        JSON.parse(localStorage.getItem('game-session') as string) as GameSession || null
    );
    const [step, setStep] = useState<'start' | 'question' | 'end'>(
        JSON.parse(localStorage.getItem('step') as string) || 'start'
    );
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
        JSON.parse(localStorage.getItem('current-question') as string) as Question || null
    );

    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onOpen: () => console.log("WebSocket connected"),
        onClose: () => console.log("WebSocket disconnected"),
    });

    useEffect(() => {
        if (readyState === 1 && socketUrl) {
            const message = JSON.stringify({
                type: "connection",
                content: "Connected to WebSocket",
            });
            sendMessage(message);
            console.log("WebSocket message sent:", message);
        }
    }, [readyState, socketUrl]);

    useEffect(() => {
        if (lastMessage !== null) {
            console.log("Received:", lastMessage.data);
        }
    }, [lastMessage]);

    useEffect(() => {
        localStorage.setItem('game-session', JSON.stringify(gameSession) as string || '');
    }, [gameSession]);

    useEffect(() => {
        localStorage.setItem('step', JSON.stringify(step) || 'start');
    }, [step]);

    useEffect(() => {
        localStorage.setItem('current-question', JSON.stringify(currentQuestion) || '');
    }, [currentQuestion]);

    const navigate = useNavigate();

    useEffect(() => {
        console.log('Game started with uuid:', uuid);

        if (!uuid) {
            createSession()
                .then((session) => {
                    setStep('start');
                    if (!session) {
                        return;
                    }

                    navigate('/game/' + session.uuid);
                    return session;
                });
            return
        }

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

    function nextQuestion() {
        console.log('Next question');

        if (!gameSession) {
            console.error('Cannot fetch next question without game session');
            return;
        }

        getNextQuestion(gameSession)
            .then((question) => {
                if (question) {
                    if (question === 'End of game') {
                        console.log('End of game');
                        setStep('end');
                        setCurrentQuestion(null);
                        return;
                    }

                    console.log('Next question fetched:', question);
                    setCurrentQuestion(question);
                } else {
                    console.error('Failed to fetch next question');
                }
            });
    }

    async function startGame(quantity: number, course: string): Promise<string> {
        console.log('Start game');

        if (!gameSession) {
            console.error('Cannot start game without game session');
            return 'failed';
        }

        setSocketUrl(Config.WebsocketURL);

        const message = JSON.stringify({
            type: "start-game",
            content: "Hello from the IU-Quiz-App!",
            gameSessionId: gameSession.uuid
        });

        console.log("Sending WebSocket message:", message);

        sendMessage(message);

        return await startGameSession(gameSession, quantity, course)
            .then((message) => {
                if (message == 'success') {
                    setStep('question');
                    nextQuestion();
                    return message;
                }

                if (message == 'not_enough_questions') {
                    return 'not_enough_questions'
                }

                console.error('Failed to start game');
                return 'failed';
            })
            .catch((error) => {
                console.error('Error starting game', error);
                return 'failed';
            });
    }

    if (!gameSession) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'} />
            </div>
        )
    }

    if (step === 'start') {
        return (
            <GameForm gameSession={gameSession} startGame={startGame} />
        )
    }

    if (step === 'question' && currentQuestion) {
        return (
            <GameQuestion question={currentQuestion} gameSession={gameSession} nextQuestion={nextQuestion} />
        )
    }

    return (
        <div className={'w-full h-full flex items-center justify-center'}>
            <Loader className={'w-28'} />
        </div>
    )
}

export default Game;