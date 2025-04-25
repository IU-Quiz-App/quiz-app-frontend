import GameForm from "@pages/quiz/GameForm.tsx";
import React, {useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Answer, GameSession, Question } from "@services/Types.ts";
import { createSession, getEphemeralToken, getGameSession } from "@services/Api.ts";
import GameQuestion from "@pages/quiz/GameQuestion.tsx";
import Loader from "@components/Loader.tsx";

import useWebSocket from "react-use-websocket";
import Config from "@services/Config.ts";
import GameResult from "@pages/quiz/GameResult.tsx";
import GameCountdown from "@pages/quiz/components/GameCountdown.tsx";

const Game: React.FC = () => {
    const { uuid: uuid } = useParams();
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [step, setStep] = useState<'quiz-form' | 'quiz-started' | 'first-question-incoming' | 'next-question' | 'waiting-for-result' | 'question-result' | 'next-question-incoming' | 'quiz-ended' | 'quiz-result'>('quiz-form');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [notEnoughQuestions, setNotEnoughQuestions] = useState<boolean>(false);

    const [seconds, setSeconds] = useState<number>(-1);

    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const { sendMessage, lastMessage } = useWebSocket(socketUrl ?? null, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        onOpen: () => console.log("WebSocket connected"),
        onClose: () => console.log("WebSocket disconnected"),
    });

    const navigate = useNavigate();
    const createdSession = useRef(false);
    const websocketUrlSet = useRef(false);

    useEffect(() => {
        if (lastMessage) {
            console.log('Last message:', lastMessage);
            const data = JSON.parse(lastMessage.data);

            const action = data.action;

            console.log(action);
            console.log(data);

            if (!action) {
                return;
            }

            if (action === 'quiz-started') {
                const seconds = data.wait_seconds;
                setSeconds(seconds);
                setStep('first-question-incoming');
            }

            if (action === 'next-question') {
                console.log("data", data);
                const question = data.question;
                const seconds = data.wait_seconds;
                setCurrentQuestion(question);
                setSeconds(seconds);
                setStep('next-question');

            }

            if (action === 'next-question-incoming') {
                setSeconds(data.wait_seconds);
                setCurrentQuestion(null);
                setStep('next-question-incoming');
            }

            if (action === 'update-game-session') {
                const gameSession = data.game_session;
                console.log('Update game session', gameSession);
                setGameSession(gameSession);
            }

            if (action === 'question-answered') {
                const seconds = data.wait_seconds;
                console.log('Answered', seconds);
                setSeconds(seconds);
                setStep('waiting-for-result');
            }

            if (action === 'correct-answer') {
                const seconds = data.wait_seconds;
                setSeconds(seconds);
                setStep('question-result');
                setCurrentQuestion(data.question);
            }

            if (action === 'quiz-ended') {
                setCurrentQuestion(null);
                setSeconds(data.wait_seconds);
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

        if (!socketUrl && !websocketUrlSet.current) {
            websocketUrlSet.current = true;
            setWebsocketUrl()
                .then(() => {
                    sendMessage(
                        JSON.stringify({
                            action: "update-websocket-information",
                            session_uuid: uuid,
                            user_uuid: "Philipp"
                        })
                    );
                });
        }

    }, [gameSession]);

    async function setWebsocketUrl() {
        const token = await getEphemeralToken();
        const url = `${Config.WebsocketURL}?token=${token}`;
        setSocketUrl(url);
    }

    useEffect(() => {
        if (!uuid) {
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
    }, [uuid]);

    useEffect(() => {
        if (createdSession.current) return;
        createdSession.current = true;

        if (!uuid) {
            createSession().then((session) => {
                if (!session) {
                    return;
                }
                console.log("Created game session", session);
                navigate(`/game/${session?.uuid}`);
            });
        }
    }, []);

    function startGame(quiz_length: number, course: string, questionAnswerTime: number) {
        console.log('Start game session');
        sendMessage(
            JSON.stringify({
                action: "start-game-session",
                game_session_uuid: uuid,
                quiz_length: quiz_length,
                course_name: course,
                question_response_time: questionAnswerTime,
            })
        );
    }

    function answerQuestion(answer: Answer) {
        sendMessage(
            JSON.stringify({
                action: "save-player-answer",
                game_session_uuid: uuid,
                question_uuid: currentQuestion?.uuid,
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

    if (step === 'quiz-form' && gameSession) {
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
            <div className={'w-full h-full flex flex-col items-center justify-center'}>
                <span>Die erste Frage kommt gleich...</span>

                <div className="flex flex-col w-full h-10">
                    <GameCountdown start={true} seconds={seconds} />
                </div>
            </div>
        )
    }

    if (step === 'next-question-incoming') {
        return (
            <div className={'w-full h-full flex flex-col items-center justify-center'}>
                <span>Nächste Frage kommt gleich...</span>

                <div className="flex flex-col w-full h-10">
                    <GameCountdown start={true} seconds={seconds} />
                </div>
            </div>
        )
    }

    if (currentQuestion && (step === 'next-question' || step === 'waiting-for-result' || step === 'question-result')) {
        return (
            <GameQuestion question={currentQuestion} answerQuestion={answerQuestion} seconds={seconds} step={step} />
        )
    }

    if (step === 'quiz-ended') {
        return (
            <div className={'w-full h-full flex flex-col items-center justify-center'}>
                <span>Quiz beendet...</span>

                <div className="flex flex-col w-full h-10">
                    <GameCountdown start={true} seconds={seconds} />
                </div>
            </div>
        )
    }

    if (step === 'quiz-result') {
        return (
            <GameResult gameSession={gameSession} animationDuration={websocketUrlSet ? 3 : 0} />
        )
    }

    return (
        <div className={'w-full h-full flex items-center justify-center'}>
            <Loader className={'w-28'} />
        </div>
    )
}

export default Game;