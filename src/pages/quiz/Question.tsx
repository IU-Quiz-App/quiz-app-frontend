import Box from "../../components/Box.tsx";
import Button from "../../components/Button.tsx";
import {useState} from "react";

const Question: React.FC = () => {

    const[answer, setAnswer] = useState<number>(0);

    const  handleOnClick = (newAnswer: number) => {
        setAnswer(newAnswer);
    }

    return (
        <div className={'flex flex-col gap-4 w-full justify-center items-center'}>
            <div className={'w-2/3 flex flex-col gap-4'}>
                <Box className={'w-full h-24'}>
                    Frage
                </Box>
                <div className={'flex flex-col w-full gap-4 h-96'}>
                    <div className={'flex flex-row w-full gap-4 grow'}>
                        <Button
                            className={'grow h-full'}
                            onClick={() => handleOnClick(1)}
                            variant={answer === 1 ? 'primary' : 'tertiary'}
                        >
                            Antwort 1
                        </Button>
                        <Button
                            className={'grow h-full'}
                            onClick={() => handleOnClick(2)}
                            variant={answer === 2 ? 'primary' : 'tertiary'}
                        >
                            Antwort 2
                        </Button>
                    </div>
                    <div className={'flex flex-row w-full gap-4 grow'}>
                        <Button
                            className={'grow h-full'}
                            onClick={() => handleOnClick(3)}
                            variant={answer === 3 ? 'primary' : 'tertiary'}
                        >
                            Antwort 3
                        </Button>
                        <Button
                            className={'grow h-full'}
                            onClick={() => handleOnClick(4)}
                            variant={answer === 4 ? 'primary' : 'tertiary'}
                        >
                            Antwort 4
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Question;