import {Answer} from "@services/Types.ts";
import {ChangeEvent, FC, useState} from "react";
import TextAreaInput from "@components/input/TextAreaInput.tsx";
import InputLabel from "@components/input/InputLabel.tsx";
import {ChevronDownIcon} from "@heroicons/react/24/outline";

interface QuestionFormAnswerProps {
    id: string,
    labelText: string,
    labelExplanation: string,
    textClassName?: string,
    explanationClassName?: string,
    answer: Answer,
    onTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    onExplanationChange: (event: ChangeEvent<HTMLTextAreaElement>) => void,
    textErrorMessage?: string,
    explanationErrorMessage?: string,
}

const QuestionFormAnswer: FC<QuestionFormAnswerProps> = ({id, labelText, labelExplanation, textClassName, explanationClassName, answer, onTextChange, onExplanationChange, explanationErrorMessage, textErrorMessage}) => {

    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <TextAreaInput
                id={`${id}-text`}
                name={`${id}-text`}
                label={labelText}
                className={`w-full ${textClassName}`}
                value={answer.text}
                onChange={onTextChange}
                errorMessage={textErrorMessage}
                required
            />
            <div className={'mb-2 flex flex-row w-min items-center justify-start whitespace-nowrap h-4'} onClick={toggleOpen}>
                <InputLabel id={`${id}-explanation`} label={labelExplanation} htmlFor={`${id}-explanation`}/>
                <ChevronDownIcon className={`w-4 h-4 ${ open ? '' : 'transform -rotate-90' }`}/>
            </div>
            {open ? (
                <TextAreaInput
                    id={`${id}-explanation`}
                    name={`${id}-explanation`}
                    className={`w-full ${explanationClassName}`}
                    value={answer.explanation}
                    onChange={onExplanationChange}
                    errorMessage={explanationErrorMessage}
                />
            ) : null}
        </div>
    );
}

export default QuestionFormAnswer;