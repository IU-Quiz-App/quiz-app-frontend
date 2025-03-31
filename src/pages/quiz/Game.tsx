import GameForm from "@pages/quiz/GameForm.tsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Answer, GameSession, Question } from "@services/Types.ts";
import { getGameSession } from "@services/Api.ts";
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
    const [step, setStep] = useState<'quiz-form' | 'quiz-started' | 'first-question-incoming' | 'next-question' | 'correct-answer' | 'next-question-incoming' | 'quiz-ended' | 'quiz-result'>('quiz-form');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [notEnoughQuestions, setNotEnoughQuestions] = useState<boolean>(false);
    const [timeOver, setTimeOver] = useState<boolean>(false);

    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const { sendMessage, lastMessage } = useWebSocket(socketUrl ?? null, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onOpen: () => console.log("WebSocket connected"),
        onClose: () => console.log("WebSocket disconnected"),
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (lastMessage) {
            const data = JSON.parse(lastMessage.data);

            const action = data.action;

            if (!action) {
                return;
            }

            console.log('Last message:', lastMessage);

            if (action === 'quiz-started') {
                setStep('first-question-incoming');
            }

            if (action === 'next-question') {
                setTimeOver(false);
                setCurrentQuestion(data.question);
                setStep('next-question');
            }

            if (action === 'next-question-incoming') {
                setCurrentQuestion(null);
                setStep('next-question-incoming');
            }

            if (action === 'update-game-session') {
                const gameSession = data.game_session;
                console.log('Update game session', gameSession);
                setGameSession(gameSession);
            }

            if (action === 'question-answered') {
                setTimeOver(true);
            }

            if (action === 'correct-answer') {
                setStep('correct-answer');
                setCurrentQuestion(data.question);
            }

            if (action === 'quiz-ended') {
                setCurrentQuestion(null);
                setStep('quiz-ended');
            }

            if (action === 'quiz-result') {
                setStep('quiz-result');
            }

            if (action === 'not-enough-questions') {
                setNotEnoughQuestions(true);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        if (!gameSession) {
            return;
        }

        if (gameSession.ended_at) {
            setStep('quiz-result');
            return;
        }

        if (gameSession.started_at) {
            setStep('quiz-started');
            return;
        }

        if (!socketUrl) {
            setSocketUrl(Config.WebsocketURL);

            sendMessage(
                JSON.stringify({
                    action: "update-websocket-information",
                    session_uuid: uuid,
                    user_uuid: "Philipp"
                })
            );
        }

    }, [gameSession]);

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
    }, [uuid]);

    function startGame(quiz_length: number, course: string) {
        console.log('Start game session');
        sendMessage(
            JSON.stringify({
                action: "start-game-session",
                game_session_uuid: uuid,
                quiz_length: quiz_length,
                course_name: course
            })
        );
    }

    function answerQuestion(answer: Answer) {
        sendMessage(
            JSON.stringify({
                action: "answer-question",
                session_uuid: uuid,
                user_uuid: "Philipp",
                answer_uuid: answer.uuid
            })
        );
    }

    if (!gameSession) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'} />
            </div>
        )
    }

    if (step === 'quiz-form') {
        return (
            <GameForm gameSession={gameSession} startGame={startGame} notEnoughQuestions={notEnoughQuestions} />
        )
    }

    if (step === 'quiz-started') {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <span>Das Quiz wird vorbereitet...</span>
                <Loader className={'w-28'}/>
            </div>
        )
    }

    if (step === 'first-question-incoming') {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <span>Die erste Frage kommt gleich...</span>
                <Loader className={'w-28'} />
            </div>
        )
    }

    if (step === 'next-question-incoming') {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <span>Nächste Frage kommt gleich...</span>
                <Loader className={'w-28'} />
            </div>
        )
    }

    if (step === 'next-question' && currentQuestion) {
        return (
            <GameQuestion question={currentQuestion} answerQuestion={answerQuestion} timeOver={timeOver} />
        )
    }

    if (step === 'correct-answer' && currentQuestion) {
        return (
            <GameQuestion question={currentQuestion} answerQuestion={answerQuestion} isResult={true} />
        )
    }

    if (step === 'quiz-ended') {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <span>Quiz beendet</span>
                <Loader className={'w-28'} />
            </div>
        )
    }

    if (step === 'quiz-result') {
        return (
            <GameResult gameSession={gameSession} />
        )
    }

    return (
        <div className={'w-full h-full flex items-center justify-center'}>
            <Loader className={'w-28'} />
        </div>
    )
}

export default Game;