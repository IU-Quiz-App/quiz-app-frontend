import Box from "../../components/Box.tsx";
import Select from "@components/input/Select.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {getAllCourses} from "@services/Api.ts";
import NumberInput from "@components/input/NumberInput.tsx";
import InputLabel from "@components/input/InputLabel.tsx";
import {GameSession} from "@services/Types.ts";
import { Crown } from "lucide-react";
import Button from "@components/Button.tsx";

interface GameFormProps {
    gameSession: GameSession;
    startGame: (quantity: number, course: string) => void;
}

const GameForm: React.FC<GameFormProps> = ({ gameSession, startGame }) => {

    const [courses, setCourses] = useState<{ value: string, label: string }[]>([]);
    const [quantity, setQuantity] = useState<number>(10);
    const [course, setCourse] = useState<string>('');

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

            fetchCourses()
                .then(() => console.log('Courses fetched'))
                .catch((error) => console.error('Error fetching courses', error));
    }, []);

    function onQuantityChange(event: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value);
        setQuantity(value);
    }

    if (!gameSession) {
        return <div>Loading...</div>
    }

    return (
        <div className={'flex flex-row gap-6 h-full max-w-2xl mx-auto'}>
            <Box className={'min-w-40 h-full flex flex-col items-start justify-start gap-4'}>
                <span className={'text-sm'}>Spieler</span>
                <div className={'flex flex-col gap-2 pl-2 w-full'}>
                {gameSession.users.map((user) => (
                        <Box className={'w-full !px-1 !py-2 flex flex-row justify-between'} key={user.name}>
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
                                onChange={(event) => setCourse(event.target.value)}
                        />
                    </div>
                    <div className={'flex justify-between w-full'}>
                        <InputLabel id={"question-quatity"} htmlFor={"question-quatity"} label={"Fragenanzahl"} required={true}/>
                        <NumberInput
                            id={"question-quatity"}
                            name={'question-quatity'}
                            value={10}
                            onChange={onQuantityChange}
                        />
                    </div>
                </div>
                <div className={'w-full h-20 flex items-end justify-end'}>
                    <Button variant={'primary'} className={''} onClick={() => startGame(quantity, course)}>
                        Spiel starten
                    </Button>
                </div>
            </Box>
        </div>
)

}

export default GameForm;