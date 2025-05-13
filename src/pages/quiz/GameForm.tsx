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
        <div className={'flex sm:flex-row flex-col gap-6 h-full max-w-3xl mx-auto'}>
            <Box className={'sm:w-1/3 w-full sm:h-full flex flex-col items-start justify-start gap-4'}>
                <span className={'text-sm'}>Spieler</span>
                <div className={'flex sm:flex-col flex-row gap-2 sm:pl-2 w-full h-16 items-start'}>
                    {gameSession.users && gameSession.users.map((user, index) => (
                        <Box className={'w-full !p-2 flex flex-row items-center sm:gap-2 w-min sm:w-full'} key={`user-${index}`}>
                            <div className={'w-6 h-6'}>
                                <Profile user={user} className={'w-6 h-6'}/>
                            </div>
                            <span className={'whitespace-nowrap hidden sm:block'}>{user.nickname}</span>
                            {user.nickname === gameSession.created_by && <Crown className={'w-6 h-6'}/>}
                        </Box>
                    ))}
                </div>
            </Box>
                <Box className={'grow h-full flex flex-col justify-between w-full'}>
                    {gameSession.created_by == user?.user_uuid ?
                        <>
                            <div className={'w-full grow flex flex-col gap-4'}>
                                <div className={'flex justify-between w-full sm:flex-row flex-col'}>
                                    <div className={'w-1/3'}>
                                        <InputLabel id={"course"} htmlFor={"course"} label={"Kurs"} required={true}/>
                                    </div>
                                    <div className={'w-1/2'}>
                                        <Select id={"course"} name={"course"} placeholder={'Kurs auswählen'} className={'truncate'}
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
                                </div>
                                <div className={'flex justify-between w-full sm:flex-row flex-col'}>
                                    <div className={'w-1/3'}>
                                        <InputLabel id={"question-type"} htmlFor={"question-type"} label={"Fragentyp"} required={true}/>
                                    </div>
                                    <div className={'w-1/2'}>
                                        <Select id={"question-type"} name={"question-type"} className={'truncate'}
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
                                </div>
                                <div className={'flex justify-between w-full sm:flex-row flex-col'}>
                                    <InputLabel id={"question-quantity"} htmlFor={"question-quantity"} label={"Fragenanzahl"} required={true}/>
                                    <NumberInput
                                        errorMessage={errors['question-quantity']}
                                        id={"question-quantity"}
                                        name={'question-quantity'}
                                        value={questionQuantity}
                                        onChange={onQuestionQuantityChange}
                                    />
                                </div>
                                <div className={'flex justify-between w-full sm:flex-row flex-col'}>
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