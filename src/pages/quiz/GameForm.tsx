import Box from "../../components/Box.tsx";
import Select from "@components/input/Select.tsx";
import React, {ChangeEvent, useEffect, useState} from "react";
import { getAllCourses } from "@services/Api.ts";
import NumberInput from "@components/input/NumberInput.tsx";
import InputLabel from "@components/input/InputLabel.tsx";
import {Course, GameSession} from "@services/Types.ts";
import { Crown } from "lucide-react";
import Button from "@components/Button.tsx";
import Loader from "@components/Loader.tsx";

interface GameFormProps {
    gameSession: GameSession;
    startGame: (questionQuantity: number, course: string, questionAnswerTime: number) => void;
    notEnoughQuestions: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ gameSession, startGame, notEnoughQuestions }) => {

    const [courses, setCourses] = useState<Course[]>([]);
    const [questionQuantity, setQuestionQuantity] = useState<number>(3);
    const [questionAnswerTime, setQuestionAnswerTime] = useState<number>(5);
    const [courseUUID, setCourseUUID] = useState<string|null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchCourses() {
            const courses = await getAllCourses();

            setCourses(courses);
        }

        fetchCourses()
            .then(() => {
                console.log('Courses fetched')
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching courses', error));
    }, [gameSession]);

    useEffect(() => {
        console.log('Not enough questions:', notEnoughQuestions);
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

        startGame(questionQuantity, courseUUID, questionAnswerTime);
    }

    if (loading) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'}/>
            </div>
        )
    }

    return (
        <div className={'flex flex-row gap-6 h-full max-w-2xl mx-auto'}>
            <Box className={'min-w-40 h-full flex flex-col items-start justify-start gap-4'}>
                <span className={'text-sm'}>Spieler</span>
                <div className={'flex flex-col gap-2 pl-2 w-full'}>
                {gameSession.users && gameSession.users.map((user, index) => (
                        <Box className={'w-full !px-1 !py-2 flex flex-row justify-between'} key={`user-${index}`}>
                            <span>{user.nickname}</span>
                            {user.nickname === gameSession.created_by && <Crown className={'w-6 h-6'}/>}
                        </Box>
                ))}
                </div>
            </Box>
            <Box className={'grow h-full flex flex-col justify-between'}>
                <div className={'w-full grow flex flex-col gap-4'}>
                    <div className={'flex justify-between w-full'}>
                        <InputLabel id={"course"} htmlFor={"course"} label={"Kurs"} required={true}/>
                        <Select id={"course"} name={"course"} className={'w-48'} placeholder={'Kurs auswählen'}
                                options={courses.map((course) => ({
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
                </div>
                <div className={'w-full h-20 flex items-end justify-end'}>
                    <Button variant={'primary'} className={''} onClick={handleStartGame}>
                        Spiel starten
                    </Button>
                </div>
            </Box>
        </div>
    )

}

export default GameForm;