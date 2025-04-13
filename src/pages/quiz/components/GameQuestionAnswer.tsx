import {Answer} from "@services/Types.ts";
import Button from "@components/Button.tsx";
import {FC} from "react";

interface GameQuestionAnswerProps {
    answer: Answer;
    onClick?: (answer: Answer) => void;
    isGiven?: boolean;
    step: 'next-question' | 'waiting-for-result' | 'question-result';
}

const GameQuestionAnswer: FC<GameQuestionAnswerProps> = ({answer, isGiven, onClick = () => {}, step}) => {
    const attributes = {
        variant: isGiven ? 'primary' : 'tertiary',
    } as any;

    if (step === 'question-result') {
        attributes.disabled = true;

        if (answer.isTrue) {
            attributes.color = 'green';
        }

        if (isGiven && !answer.isTrue) {
            attributes.color = 'red';
        }
    }

    if (step !== 'next-question' || !onClick) {
        attributes.disabled = true;
    }

    return(
        <Button
            onClick={() => onClick(answer)}
            {...attributes}
        >
            {answer.text}
        </Button>
    )
};

export default GameQuestionAnswer;