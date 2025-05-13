import TextAreaInput from "../../components/input/TextAreaInput.tsx";
import Button from "../../components/Button.tsx";
import {Answer, Question} from "../../services/Types.ts";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import { getQuestion, saveQuestion, deleteQuestion, updateQuestion } from "../../services/Api.ts";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@components/Loader.tsx";
import Box from "@components/Box.tsx";
import Select from "@components/input/Select.tsx";
import QuestionFormAnswer from "@pages/question/QuestionFormAnswer.tsx";
import CheckBox from "@components/input/CheckBox.tsx";
import InputLabel from "@components/input/InputLabel.tsx";
import {AuthContext} from "../../auth/hooks/AuthProvider.tsx";

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
    const [publicQuestion, setPublicQuestion] = useState<boolean>(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (!uuid) {
                setDefaultValues();
                return;
            }
            const question = await getQuestion(uuid);

            if (!question) {
                return;
            }

            console.log(question);

            setCourse(question.course);
            setPublicQuestion(question.public);
            setQuestionText(question.text);
            setWrongAnswers(question.answers.slice(1));
            setCorrectAnswer(question.answers[0]);
        }

        fetchData()
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
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

    const handleWrongAnswerExplanationTextChange = (index: 0 | 1 | 2) => (event: ChangeEvent<HTMLTextAreaElement>) => {
        setWrongAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[index] = {
                text: prev[index].text,
                explanation: event.target.value,
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

    const handleCorrectAnswerExplanationTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCorrectAnswer((prev) => {
            return { ...prev, explanation: event.target.value };
        });
    }

    const handlePublicQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPublicQuestion(event.target.checked);
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
            public: publicQuestion,
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
                        options={user?.courses.map((course) => ({
                            label: course.description && course.description.trim() !== ''
                                ? `${course.name} - ${course.description}`
                                : course.name,
                            value: course.uuid
                        })) ?? []}
                        onChange={handleCourseChange}
                        errorMessage={errors['course'] as string}
                    />
                    <div className={'w-full flex items-start gap-2 items-center'}>
                        <InputLabel id={'public-question'} label={'Öffentliche Frage'} htmlFor={'public-question'} className={'w-min whitespace-nowrap'} />
                        <CheckBox id={'public-question'} name={'public-question'} checked={publicQuestion} onChange={handlePublicQuestionChange}/>
                    </div>
                </div>

                <QuestionFormAnswer
                    textClassName={'bg-green-100'}
                    explanationClassName={'h-28 bg-green-200'}
                    id={'correctAnswer'}
                    labelText={'Korrekte Antwort'}
                    labelExplanation={'Korrekte Antwort Erklärung'}
                    answer={correctAnswer}
                    onTextChange={handleCorrectAnswerTextChange}
                    onExplanationChange={handleCorrectAnswerExplanationTextChange}
                />

                {wrongAnswers.map((answer, index) => (
                    <QuestionFormAnswer
                        key={`wrongAnswer${index + 1}`}
                        textClassName={'bg-red-100'}
                        explanationClassName={'h-28 bg-red-200'}
                        id={`wrongAnswer${index + 1}`}
                        labelText={`Falsche Antwort ${index + 1}`}
                        labelExplanation={`Falsche Antwort ${index + 1} Erklärung`}
                        answer={answer}
                        onTextChange={handleWrongAnswerTextChange(index as 0 | 1 | 2)}
                        onExplanationChange={handleWrongAnswerExplanationTextChange(index as 0 | 1 | 2)}
                        textErrorMessage={errors[`wrongAnswer${index + 1}`] as string}
                    />
                ))}
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