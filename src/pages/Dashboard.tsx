import Button from "../components/Button.tsx";
//import useWebSocket from "react-use-websocket";
//import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {createSession} from "@services/Api.ts";
import React, {useState} from "react";
import Loader from "@components/Loader.tsx";
//import Config from "@services/Config.ts";

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);


    const navigate = useNavigate();

    function startGame() {
        console.log('Start game');
        setLoading(true);
        createSession()
            .then((session) => {
                if (!session) {
                    return;
                }

                navigate(`/game/${session?.uuid}`);
            });
    }

    if (loading) {
        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-28'} />
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            {/* Welcome */}
            <h1 className="text-2xl font-bold text-blue-700 text-center">
                Willkommen bei der IU-Quiz-App!
            </h1>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-6">
                <Button variant={'secondary'} className={'w-fit h-fit'} onClick={startGame}>
                    Spiel starten
                </Button>

                <Button variant={'primary'} className={'w-fit h-fit'} route={'/question/form'}>
                    Frage erstellen
                </Button>

                <Button variant={'primary'} className={'w-fit h-fit'} route={'/questions'}>
                    Alle Fragen anzeigen
                </Button>
            </div>
        </div>
    );
}

export default Dashboard;