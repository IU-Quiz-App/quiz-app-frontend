import {GameSession} from "@services/Types.ts";
import Button from "@components/Button.tsx";
import GameQuestionResult from "./GameQuestionResult";
import GamePodium from "@pages/quiz/components/GamePodium.tsx";

interface GameResultProps {
    gameSession: GameSession,
}

const GameResult: React.FC<GameResultProps> = ({ gameSession }) => {

    if (!gameSession.questions) {
        return (
            <div>
                <h2>No questions found</h2>
            </div>
        )
    }

    return (
        <div className={'flex flex-col gap-4'}>
            <GamePodium gameSession={gameSession}/>
            {gameSession.questions.map(function (question, index) {
                return (
                    <GameQuestionResult
                        key={index}
                        users={gameSession.users}
                        question={question}
                    />
                )
            })}
            <div className={'flex flex-row flex-end gap-4'}>
                <Button variant={'primary'} route={'/dashboard'}>
                    zum Dashboard
                </Button>
            </div>
        </div>
    )

}

export default GameResult;