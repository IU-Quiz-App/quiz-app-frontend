import TextInput from "../../components/input/TextInput.tsx";
import TextAreaInput from "../../components/input/TextAreaInput.tsx";
import Button from "../../components/Button.tsx";
import {Answer, Question} from "../../services/Types.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {saveQuestion} from "../../services/Api.ts";

interface QuestionFormProps {
    question: Question;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question }) => {

    const [course, setCourse] = useState('');
    const [questionText, setQuestionText] = useState<string>('');
    const [answers, setAnswers] = useState<Answer[]>([
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
    ]);
    const [correctAnswer, setCorrectAnswer] = useState<1|2|3|4|undefined>(undefined);

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if(question) {
            setCourse(question.course);
            setQuestionText(question.text);
            setAnswers(question.answers);
        }
    } ,[question]);

    const handleQuestionTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestionText(event.target.value);
    }

    const handleCourseTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCourse(event.target.value);
    }

    const handleAnswerTextChange = (index: number) => (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[index] = {
                text: event.target.value,
                explanation: '',
            }
            return newAnswers;
        });
    }

    const handleSave = () => {
        setErrors({});


        let hasError = false;


        setTimeout(() => {
            if (questionText === '') {
                setErrors((prev) => ({
                    ...prev,
                    question: 'Die Frage darf nicht leer sein',
                }));
                hasError = true;
            }

            answers.forEach((answer, index) => {
                if (answer.text === '') {
                    setErrors((prev) => ({
                        ...prev,
                        [`answer${index + 1}`]: 'Die Antwort darf nicht leer sein',
                    }));

                    hasError = true;
                }
            });
        });

        if (hasError) {
            return;
        }

        const newQuestion: Question = {
            id: question?.id,
            course: course,
            text: questionText,
            answers: answers,
            correctAnswer: 1,
        }

        saveQuestion(newQuestion);

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
                        id={'answer1'}
                        name={'answer1'}
                        label={'Antwort 1'}
                        className={'grow h-28'}
                        value={answers[0].text}
                        onChange={handleAnswerTextChange(0)}
                        errorMessage={errors['answer1'] as string}
                        required
                    />

                    <TextAreaInput
                        id={'answer2'}
                        name={'answer2'}
                        label={'Antwort 2'}
                        className={'grow h-28'}
                        value={answers[1].text}
                        onChange={handleAnswerTextChange(1)}
                        errorMessage={errors['answer2'] as string}
                        required
                    />
                </div>

                <div className={"flex flex-row w-full gap-4"}>

                    <TextAreaInput
                        id={'answer3'}
                        name={'answer3'}
                        label={'Antwort 3'}
                        className={'grow h-28'}
                        value={answers[2].text}
                        onChange={handleAnswerTextChange(2)}
                        errorMessage={errors['answer3'] as string}
                        required
                    />

                    <TextAreaInput
                        id={'answer4'}
                        name={'answer4'}
                        label={'Antwort 4'}
                        className={'grow h-28'}
                        value={answers[3].text}
                        onChange={handleAnswerTextChange(3)}
                        errorMessage={errors['answer4'] as string}
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