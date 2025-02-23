import Box from "../../components/Box.tsx";
import Select from "@components/input/Select.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {getAllCourses} from "@services/Api.ts";
import NumberInput from "@components/input/NumberInput.tsx";
import InputLabel from "@components/input/InputLabel.tsx";

const StartGame: React.FC = () => {

    const [courses, setCourses] = useState<{ value: string, label: string }[]>([]);
    const [quantity, setQuantity] = useState<number>(10);

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

    return (
        <div className={'flex flex-row gap-6 h-full w-1/2 mx-auto'}>
            <Box className={'grow h-full flex flex-col items-start justify-start gap-4'}>
                <div className={'flex justify-between w-full'}>
                    <InputLabel id={"course"} htmlFor={"course"} label={"Kurs"} required={true}/>
                    <Select id={"course"} name={"course"} className={'w-48'} placeholder={'Kurs auswählen'}
                            options={courses}/>
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
            </Box>
        </div>
)

}

export default StartGame;