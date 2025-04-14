import GameTableWrapper from "@pages/quiz/GameTableWrapper.tsx";
import Button from "@components/Button.tsx";
import {useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {


    const navigate = useNavigate();

    function startGame() {
        navigate("/game");
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            {/* Welcome */}
            <h1 className="text-2xl font-bold text-blue-700 text-center">
                Willkommen bei der IU-Quiz-App!
            </h1>

            <Button variant={'secondary'} className={'w-fit h-fit'} onClick={startGame}>
                Spiel starten
            </Button>
            <div className="flex items-center justify-center gap-6 grow w-full px-52">
                <GameTableWrapper/>
            </div>
        </div>
    );
}

export default Dashboard;