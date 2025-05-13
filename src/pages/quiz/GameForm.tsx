import Box from "../../components/Box.tsx";
import Select from "@components/input/Select.tsx";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import NumberInput from "@components/input/NumberInput.tsx";
import InputLabel from "@components/input/InputLabel.tsx";
import {GameSession} from "@services/Types.ts";
import { Crown } from "lucide-react";
import Button from "@components/Button.tsx";
import Config from "@services/Config.ts";
import Profile from "@components/Profile.tsx";
import {AuthContext} from "../../auth/hooks/AuthProvider.tsx";

interface GameFormProps {
    gameSession: GameSession;
    startGame: (questionQuantity: number, course: string, questionAnswerTime: number, questionType: 'public'|'private'|'all') => void;
    notEnoughQuestions: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ gameSession, startGame, notEnoughQuestions }) => {

    const [questionQuantity, setQuestionQuantity] = useState<number>(3);
    const [questionAnswerTime, setQuestionAnswerTime] = useState<number>(5);
    const [courseUUID, setCourseUUID] = useState<string|null>(null);
    const [questionType, setQuestionType] = useState<'public'|'private'|'all'>('all');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (notEnoughQuestions) {
            setErrors({
                ...errors,
                'question-quantity': 'Nicht genügend Fragen für das Quiz'
            });
        }
    }, [notEnoughQuestions]);

    function onQuestionQuantityChange(event: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value);
        setQuestionQuantity(value);
    }

    function onQuestionAnswerTimeChange(event: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value);
        setQuestionAnswerTime(value);
    }

    if (!gameSession) {
        return <div>Loading...</div>
    }

    function handleStartGame() {


        setErrors({});

        if (!courseUUID) {
            setTimeout(() => {
                setErrors({
                    ...errors,
                    course: 'Bitte wähle einen Kurs aus'
                });
            });
            return;
        }

        if (questionQuantity < 1) {
            setTimeout(() => {
                setErrors({
                    ...errors,
                    'question-quantity': 'Bitte gib eine gültige Anzahl an Fragen an'
                });
            });
            return;
        }

        if (questionAnswerTime < 1) {
            setTimeout(() => {
                setErrors({
                    ...errors,
                    'question-answer-time': 'Bitte gib eine gültige Zeit an'
                });
            });
            return;
        }

        startGame(questionQuantity, courseUUID, questionAnswerTime, questionType);
    }

    function copyLinkToClipboard() {
        navigator.clipboard.writeText(`${Config.AppURL}/join-game/${gameSession.uuid}`)
            .then(() => {
                alert('Link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying link to clipboard', error);
            });
    }

    return (
        <div className={'flex flex-row gap-6 h-full max-w-2xl mx-auto'}>
            <Box className={'min-w-52 h-full flex flex-col items-start justify-start gap-4'}>
                <span className={'text-sm'}>Spieler</span>
                <div className={'flex flex-col gap-2 pl-2 w-full'}>
                {gameSession.users && gameSession.users.map((user, index) => (
                        <Box className={'w-full !px-2 !py-2 flex flex-row items-center gap-2'} key={`user-${index}`}>
                            <div className={'w-6 h-6'}>
                                <Profile user={user} className={'w-6 h-6'}/>
                            </div>
                            <span className={'whitespace-nowrap'}>{user.nickname}</span>
                            {user.nickname === gameSession.created_by && <Crown className={'w-6 h-6'}/>}
                        </Box>
                ))}
                </div>
            </Box>
                <Box className={'grow h-full flex flex-col justify-between'}>
                    {gameSession.created_by == user?.user_uuid ?
                        <>
                            <div className={'w-full grow flex flex-col gap-4'}>
                                <div className={'flex justify-between w-full'}>
                                    <InputLabel id={"course"} htmlFor={"course"} label={"Kurs"} required={true}/>
                                    <Select id={"course"} name={"course"} className={'w-48'} placeholder={'Kurs auswählen'}
                                            options={user.courses.map((course) => ({
                                                label: course.description && course.description.trim() !== ''
                                                    ? `${course.name} - ${course.description}`
                                                    : course.name,
                                                value: course.uuid
                                            }))}
                                            errorMessage={errors['course']}
                                            onChange={(event) => setCourseUUID(event.target.value)}
                                    />
                                </div>
                                <div className={'flex justify-between w-full'}>
                                    <InputLabel id={"question-type"} htmlFor={"question-type"} label={"Fragentyp"} required={true}/>
                                    <Select id={"question-type"} name={"question-type"} className={'w-48'}
                                            options={[
                                                { label: 'Alle Fragen', value: 'all' },
                                                { label: 'Nur private Frage', value: 'private' },
                                                { label: 'Nur öffentliche Frage', value: 'public' },
                                            ]}
                                            value={questionType}
                                            errorMessage={errors['question-type']}
                                            onChange={(event) => setQuestionType(event.target.value as 'public'|'private'|'all')}
                                    />
                                </div>
                                <div className={'flex justify-between w-full'}>
                                    <InputLabel id={"question-quantity"} htmlFor={"question-quantity"} label={"Fragenanzahl"} required={true}/>
                                    <NumberInput
                                        errorMessage={errors['question-quantity']}
                                        id={"question-quantity"}
                                        name={'question-quantity'}
                                        value={questionQuantity}
                                        onChange={onQuestionQuantityChange}
                                    />
                                </div>
                                <div className={'flex justify-between w-full'}>
                                    <InputLabel id={"question-answer-time"} htmlFor={"question-answer-time"} label={"Antwortzeit"} required={true}/>
                                    <NumberInput
                                        errorMessage={errors['question-answer-time']}
                                        id={"question-answer-time"}
                                        name={'question-answer-time'}
                                        value={questionAnswerTime}
                                        onChange={onQuestionAnswerTimeChange}
                                    />
                                </div>

                                <div className={'flex max-w-full overflow-hidden justify-between'}>
                                    <Box className={'py-0.5 grow rounded-r-none overflow-auto px-0'}>
                                        <div className={'overflow-auto max-w-full scrollbar-hide'}>
                                            <span className={'whitespace-nowrap mx-2'}>
                                                {`${Config.AppURL}/join-game/${gameSession.uuid}`}
                                            </span>
                                        </div>
                                    </Box>
                                    <Button
                                        onClick={copyLinkToClipboard}
                                        className={'py-0.5 rounded-l-none'}
                                    >
                                        Kopieren
                                    </Button>
                                </div>

                            </div>
                            <div className={'w-full h-20 flex items-end justify-end'}>
                                <Button variant={'primary'} className={''} onClick={handleStartGame}>
                                    Spiel starten
                                </Button>
                            </div>
                        </>
                        :
                        <div className={'w-full h-full flex items-center justify-center'}>
                            <span className={'text-sm text-gray-400'}>Warte auf den Spielleiter...</span>
                        </div>
                    }
                </Box>
        </div>
    )

}

export default GameForm;