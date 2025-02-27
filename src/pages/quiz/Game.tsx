import GameForm from "@pages/quiz/GameForm.tsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {GameSession, Question} from "@services/Types.ts";
import {createSession, getGameSession, getNextQuestion, startGameSession} from "@services/Api.ts";
import GameQuestion from "@pages/quiz/GameQuestion.tsx";


const Game: React.FC = () => {
    const { uuid: uuid } = useParams();
    const [gameSession, setGameSession] = useState<GameSession | null>(
        JSON.parse(localStorage.getItem('game-session') as string) as GameSession || null
    );
    const [step, setStep] = useState<'start'|'question'|'end'>(
        JSON.parse(localStorage.getItem('step') as string) || 'start'
    );
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
        JSON.parse(localStorage.getItem('current-question') as string) as Question || null
    );

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

    function startGame(quantity: number, course: string) {
        console.log('Start game');

        if (!gameSession) {
            console.error('Cannot start game without game session');
            return;
        }

        startGameSession(gameSession, quantity, course)
            .then((success) => {
                if (success) {
                    console.log('Game started');

                    setStep('question');

                    nextQuestion();
                } else {
                    console.error('Failed to start game');
                }
            });
    }

    if (!gameSession) {
        return <div>Loading...</div>
    }

    if (step === 'start') {
        return  (
            <GameForm gameSession={gameSession} startGame={startGame}/>
        )
    }

    if (step === 'question' && currentQuestion) {
        return (
            <GameQuestion question={currentQuestion} gameSession={gameSession} nextQuestion={nextQuestion}/>
        )
    }
}

export default Game;