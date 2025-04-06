import Box from "../../components/Box.tsx";
import Select from "@components/input/Select.tsx";
import React, {ChangeEvent, useEffect, useState} from "react";
import {getAllCourses, getUserByUUID } from "@services/Api.ts";
import NumberInput from "@components/input/NumberInput.tsx";
import InputLabel from "@components/input/InputLabel.tsx";
import {GameSession, User} from "@services/Types.ts";
import { Crown } from "lucide-react";
import Button from "@components/Button.tsx";
import Loader from "@components/Loader.tsx";

interface GameFormProps {
    gameSession: GameSession;
    startGame: (quantity: number, course: string) => void;
    notEnoughQuestions: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ gameSession, startGame, notEnoughQuestions }) => {

    const [courses, setCourses] = useState<{ value: string, label: string }[]>([]);
    const [quantity, setQuantity] = useState<number>(3);
    const [course, setCourse] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchCourses() {
            const courses = await getAllCourses();

            const courseOptions = courses.map(course => {
                return {
                    value: course,
                    label: course
                }
            });

            setCourses(courseOptions);
        }

        async function fetchUsers() {
            if (!gameSession.users) {
                return;
            }

            const users = gameSession.users.map(async (uuid) => {
                return await getUserByUUID(uuid);
            });

            setUsers(await Promise.all(users));
        }

        fetchCourses()
            .then(() => {
                console.log('Courses fetched')
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching courses', error));

        fetchUsers()
            .then(() => {
                console.log('Users fetched')
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching users', error));
    }, [gameSession]);

    useEffect(() => {
        if (notEnoughQuestions) {
            setErrors({
                ...errors,
                'question-quantity': 'Nicht genügend Fragen für das Quiz'
            });
        }
    }, [notEnoughQuestions]);

    function onQuantityChange(event: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value);
        setQuantity(value);
    }

    if (!gameSession) {
        return <div>Loading...</div>
    }

    function handleStartGame() {


        setErrors({});

        if (!course) {
            setTimeout(() => {
                setErrors({
                    ...errors,
                    course: 'Bitte wähle einen Kurs aus'
                });
            });
            return;
        }

        startGame(quantity, course);
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
                {users && users.map((user, index) => (
                        <Box className={'w-full !px-1 !py-2 flex flex-row justify-between'} key={`user-${index}`}>
                            <span>{user.name}</span>
                            {user.name === gameSession.created_by && <Crown className={'w-6 h-6'}/>}
                        </Box>
                ))}
                </div>
            </Box>
            <Box className={'grow h-full flex flex-col justify-between'}>
                <div className={'w-full grow flex flex-col gap-4'}>
                    <div className={'flex justify-between w-full'}>
                        <InputLabel id={"course"} htmlFor={"course"} label={"Kurs"} required={true}/>
                        <Select id={"course"} name={"course"} className={'w-48'} placeholder={'Kurs auswählen'}
                                options={courses}
                                errorMessage={errors['course']}
                                onChange={(event) => setCourse(event.target.value)}
                        />
                    </div>
                    <div className={'flex justify-between w-full'}>
                        <InputLabel id={"question-quantity"} htmlFor={"question-quantity"} label={"Fragenanzahl"} required={true}/>
                        <NumberInput
                            errorMessage={errors['question-quantity']}
                            id={"question-quantity"}
                            name={'question-quantity'}
                            value={quantity}
                            onChange={onQuantityChange}
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