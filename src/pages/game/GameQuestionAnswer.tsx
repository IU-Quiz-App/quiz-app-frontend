import {Answer, User, UserAnswer} from "@services/Types.ts";
import Button from "@components/Button.tsx";
import {FC, useContext} from "react";
import Profile from "@components/Profile.tsx";
import {Popover} from "@components/Popover.tsx";
import {InfoIcon} from "lucide-react";
import {AuthContext} from "../../auth/hooks/AuthProvider.tsx";

interface GameQuestionAnswerProps {
    id?: string;
    answer: Answer;
    onClick?: (answer: Answer) => void;
    isGiven?: boolean;
    step: 'next-question' | 'waiting-for-result' | 'question-result';
    users?: User[];
}

const GameQuestionAnswer: FC<GameQuestionAnswerProps> = ({answer, isGiven, onClick = () => {}, step, users = [], id}) => {

    const { user } = useContext(AuthContext);

    const inUserAnswers = answer.user_answers?.some(userAnswer => userAnswer.user_uuid === user?.user_uuid);
    isGiven = inUserAnswers || isGiven;

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

    function getPopoverInfo(user: User, answer: UserAnswer) {
        return (
            <div className={'flex flex-row gap-2'}>
                <span>{user.nickname}</span>
                {answer.score ? (
                    <span className={'text-green-500'}>+{answer.score}</span>
                ) : null}
            </div>
        )
    }

    return(
        <div className={'relative'} id={id}>
            <Button
                onClick={() => onClick(answer)}
                {...attributes}
                className={'w-full h-full absolute flex flex-row gap-2'}
            >
                <span>
                    {answer.text}
                </span>
                {step === 'question-result' ? (
                    <Popover id={`quiz-result-answer-${answer.uuid}`} key={answer.uuid} info={answer.explanation ? answer.explanation : "Keine Erklärung vorhanden"}>
                        <InfoIcon className={'h-5 w-5'}/>
                    </Popover>
                ) : null}
            </Button>
            <div className={'w-full h-full absolute p-2 pointer-events-none flex flex-row'}>
                {answer.user_answers?.map((userAnswer, index) => {
                    const user = users.find(user => user.user_uuid === userAnswer.user_uuid);
                    if (!user) {
                        return null;
                    }

                    return (
                            <div className={'w-5 h-8 pointer-events-auto'} key={index}>
                                <Popover id={`quiz-result-profile-${user.user_uuid}`} info={getPopoverInfo(user, userAnswer)} key={index}>
                                    <Profile user={user} key={index} className={'h-8 w-8'}/>
                                </Popover>
                            </div>
                    )
                })}
            </div>
        </div>

    )
};

export default GameQuestionAnswer;