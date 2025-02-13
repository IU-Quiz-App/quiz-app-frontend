import TextInput from "../../components/input/TextInput.tsx";
import TextAreaInput from "../../components/input/TextAreaInput.tsx";
import Button from "../../components/Button.tsx";
import { Answer, Question } from "../../services/Types.ts";
import { ChangeEvent, useEffect, useState } from "react";
import { getQuestion, saveQuestion } from "../../services/Api.ts";
import { useParams } from "react-router-dom";

interface QuestionFormProps {
    uuid?: string | undefined;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ uuid }) => {
    const { uuid: uuidParam } = useParams();

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

        fetchData()
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

    const handleCourseTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCourse(event.target.value);
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
            public: "false",
            status: 'created',
            course: course,
            text: questionText,
            answers: answerList
        }

        saveQuestion(newQuestion);

        setDefaultValues();
    }

    return (
        <div className={'w-full flex flex-col gap-6'}>
            <div className={'text-2xl mb-6'}>
                Frage erstellen
            </div>

            <TextInput
                id={'course'}
                name={'course'}
                label={'Kurs'}
                className={'w-32'}
                value={course}
                onChange={handleCourseTextChange}
                errorMessage={''}
            />

            <TextAreaInput
                id={'question'}
                name={'question'}
                label={'Frage'}
                className={'h-28'}
                value={questionText}
                onChange={handleQuestionTextChange}
                errorMessage={errors['question'] as string}
                required
            />

            <div className={'flex flex-col gap-4'}>
                <div className={"flex flex-row w-full gap-4"}>
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
                </div>

                <div className={"flex flex-row w-full gap-4"}>
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
            </div>

            <div className={'w-full flex items-end mt-8 justify-end'}>
                <Button onClick={handleSave}>
                    Speichern
                </Button>
            </div>
        </div>
    )

}

export default QuestionForm;