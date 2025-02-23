import Box from "../../components/Box.tsx";
import Select from "@components/input/Select.tsx";
import {useEffect, useState} from "react";
import {getAllCourses} from "@services/Api.ts";
import NumberInput from "@components/input/NumberInput.tsx";

const StartGame: React.FC = () => {

    const [courses, setCourses] = useState<{ value: string, label: string }[]>([]);

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

    function onQuantityChange(number: number): void {
        console.log('Quantity changed');
    }

    return (
        <div className={'flex flex-row gap-6 h-full w-1/2 mx-auto'}>
            <Box className={'grow h-full flex flex-col items-start justify-start'}>
                <Select id={"course"} name={"course"} className={'w-96'} placeholder={'Kurs auswählen'} options={courses}/>

                <NumberInput id={"question-amount"} value={10} onQuantityChange={onQuantityChange}/>
            </Box>
        </div>
    )

}

export default StartGame;