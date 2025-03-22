import GameForm from "@pages/quiz/GameForm.tsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Answer, GameSession, Question} from "@services/Types.ts";
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
    const [step, setStep] = useState<'start' | 'question' | 'end'>('start');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null);
    const [notEnoughQuestions, setNotEnoughQuestions] = useState<boolean>(false);

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

            if (data.action === 'next-question') {
                setCurrentQuestion(data.question);
                setStep('question');
            }

            if (data.action === 'update-game-session') {
                setGameSession(data.game_session);
            }

            if (data.action === 'correct-answer') {
                setCorrectAnswer(data.answer);
            }

            if (data.action === 'not-enough-questions') {
                setNotEnoughQuestions(true);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        if (!gameSession) {
            return;
        }

        if (gameSession.ended_at) {
            setStep('end');
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
        sendMessage(
            JSON.stringify({
                action: "start-game",
                uuid: uuid,
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

    if (step === 'start') {
        return (
            <GameForm gameSession={gameSession} startGame={startGame} notEnoughQuestions={notEnoughQuestions}/>
        )
    }

    if (step === 'question' && currentQuestion) {
        return (
            <GameQuestion question={currentQuestion} answerQuestion={answerQuestion} correctAnswer={correctAnswer} />
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