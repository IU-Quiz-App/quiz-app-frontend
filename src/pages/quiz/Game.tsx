import StartGame from "@pages/quiz/StartGame.tsx";
import React from "react";
import {useParams} from "react-router-dom";


const Game: React.FC = () => {
    const { uuid: uuid } = useParams();

    return (
        <StartGame/>
    )
}

export default Game;