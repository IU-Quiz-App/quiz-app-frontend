import TextAreaInput from "../../components/input/TextAreaInput.tsx";
import Button from "../../components/Button.tsx";
import { Answer, Question } from "../../services/Types.ts";
import React, { ChangeEvent, useEffect, useState } from "react";
import { getQuestion, saveQuestion, deleteQuestion, updateQuestion, getAllCourses } from "../../services/Api.ts";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@components/Loader.tsx";
import Box from "@components/Box.tsx";
import Select from "@components/input/Select.tsx";

interface QuestionFormProps {
    uuid?: string | undefined;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ uuid }) => {
    const { uuid: uuidParam } = useParams();
    const navigate = useNavigate();

    uuid = uuid || uuidParam;

    const [course, setCourse] = useState('');
    const [questionText, setQuestionText] = useState<string>('');
    const [wrongAnswers, setWrongAnswers] = useState<Answer[]>([
        { text: '', explanation: '', isTrue: false },
        { text: '', explanation: '', isTrue: false },
        { text: '', explanation: '', isTrue: false },
    ]);
    const [correctAnswer, setCorrectAnswer] = useState<Answer>({ text: '', explanation: '', isTrue: true });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [courses, setCourses] = useState<{ value: string, label: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!uuid) {
                return;
            }
            const question = await getQuestion(uuid);

            if (!question) {
                return;
            }

            console.log(question);

            setCourse(question.course);
            setQuestionText(question.text);
            setWrongAnswers(question.answers.slice(1));
            setCorrectAnswer(question.answers[0]);
        }

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

        fetchData()
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });

        fetchCourses()
            .then(() => console.log('Courses fetched'))
            .catch((error) => console.error('Error fetching courses', error));
    }, [uuid]);

    const setDefaultValues = () => {
        setCourse('');
        setQuestionText('');
        setWrongAnswers([
            { text: '', explanation: '', isTrue: false },
            { text: '', explanation: '', isTrue: false },
            { text: '', explanation: '', isTrue: false },
        ]);
        setCorrectAnswer({ text: '', explanation: '', isTrue: true });
    }

    const handleQuestionTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestionText(event.target.value);
    }

    const handleCourseChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const course = event.target.value;
        console.log('Course:', course);

        setCourse(course);
    }

    const handleWrongAnswerTextChange = (index: 0 | 1 | 2) => (event: ChangeEvent<HTMLTextAreaElement>) => {
        setWrongAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[index] = {
                text: event.target.value,
                explanation: prev[index].explanation,
                isTrue: false
            }
            return newAnswers;
        });
    }

    const handleCorrectAnswerTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCorrectAnswer((prev) => {
            return { ...prev, text: event.target.value };
        });
    }

    const handleSave = () => {
        setErrors({});


        let hasError = false;

        if (course === '') {

            setTimeout(() => {
                setErrors((prev) => ({
                    ...prev,
                    course: 'Es muss ein Kurs angegeben werden',
                }));
            });
            hasError = true;
        }


        if (questionText === '') {

            setTimeout(() => {
                setErrors((prev) => ({
                    ...prev,
                    question: 'Die Frage darf nicht leer sein',
                }));
            });
            hasError = true;
        }

        wrongAnswers.forEach((answer, index) => {
            if (answer.text === '') {

                setTimeout(() => {
                    setErrors((prev) => ({
                        ...prev,
                        [`wrongAnswer${index + 1}`]: 'Die falsche Antwort darf nicht leer sein',
                    }));
                });

                hasError = true;
            }
        });

        if (correctAnswer.text === '') {
            setTimeout(() => {
                setErrors((prev) => ({
                    ...prev,
                    [`correctAnswer`]: 'Die richtige Antwort darf nicht leer sein',
                }));
            });

            hasError = true;
        }

        if (hasError) {
            return;
        }

        const answerList = [correctAnswer, ...wrongAnswers]

        const newQuestion: Question = {
            uuid: uuid,
            public: 'false',
            status: 'created',
            course: course,
            text: questionText,
            answers: answerList
        }

        if (uuid) {
            updateQuestion(newQuestion).then((success) => {
                if (success) {
                    setDefaultValues();
                    navigate('/questions');
                }
            });
            return;
        }

        saveQuestion(newQuestion).then((success) => {
            if (success) {
                setDefaultValues();
                navigate('/questions');
            }
        });
    }

    const handleDelete = () => {
        deleteQuestion(uuid, course)
            .then(() => {
                console.log('Question deleted');
            });
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    return (
        <Box className={'w-full flex flex-col gap-6 text-white'}>
            <div className={'text-2xl mb-6'}>
                Frage erstellen
            </div>

            <div className={'grid grid-cols-2 gap-4'}>
                <TextAreaInput
                    id={'question'}
                    name={'question'}
                    label={'Frage'}
                    className={'grow h-28'}
                    value={questionText}
                    onChange={handleQuestionTextChange}
                    errorMessage={errors['question'] as string}
                    required
                />
                <div className={'flex flex-col grow'}>
                    <Select
                        id={'course'}
                        name={'course'}
                        label={'Kurs'}
                        className={'w-32'}
                        value={course}
                        required
                        options={courses}
                        onChange={handleCourseChange}
                        errorMessage={errors['course'] as string}
                    />
                </div>

                <TextAreaInput
                    id={'correctAnswer'}
                    name={'correctAnswer'}
                    label={'Korrekte Antwort'}
                    className={'grow h-28 bg-green-100'}
                    value={correctAnswer.text}
                    onChange={handleCorrectAnswerTextChange}
                    errorMessage={errors['correctAnswer'] as string}
                    required
                />

                <TextAreaInput
                    id={'wrongAnswer1'}
                    name={'wrongAnswer1'}
                    label={'Falsche Antwort 1'}
                    className={'grow h-28'}
                    value={wrongAnswers[0].text}
                    onChange={handleWrongAnswerTextChange(0)}
                    errorMessage={errors['wrongAnswer1'] as string}
                    required
                />
                <TextAreaInput
                    id={'wrongAnswer2'}
                    name={'wrongAnswer2'}
                    label={'Falsche Antwort 2'}
                    className={'grow h-28'}
                    value={wrongAnswers[1].text}
                    onChange={handleWrongAnswerTextChange(1)}
                    errorMessage={errors['wrongAnswer2'] as string}
                    required
                />
                <TextAreaInput
                    id={'wrongAnswer3'}
                    name={'wrongAnswer3'}
                    label={'Falsche Antwort 3'}
                    className={'grow h-28'}
                    value={wrongAnswers[2].text}
                    onChange={handleWrongAnswerTextChange(2)}
                    errorMessage={errors['wrongAnswer3'] as string}
                    required
                />
            </div>

            <div className={'w-full flex items-end mt-8 justify-end gap-4'}>
                <Button onClick={handleSave}>
                    Speichern
                </Button>
                {uuid && (
                    <Button onClick={handleDelete} color="red" variant="primary" route="/questions">
                        Löschen
                    </Button>
                )}
            </div>
        </Box>
    )

}

export default QuestionForm;