import Button from "../components/Button.tsx";
import useWebSocket from "react-use-websocket";
import {useEffect} from "react";

const Dashboard: React.FC = () => {

    const WEBSOCKET_URL = "ws.dev.iu-quiz.de";

    const { sendMessage, lastMessage } = useWebSocket(WEBSOCKET_URL, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    useEffect(() => {
        sendMessage('Hello from the IU-Quiz-App!', true);
    }, [lastMessage]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            {/* Welcome */}
            <h1 className="text-2xl font-bold text-blue-700 text-center">
                Willkommen bei der IU-Quiz-App!
            </h1>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-6">
                <Button variant={'secondary'} className={'w-fit h-fit'} route={'/quiz/question'}>
                    Spiel starten
                </Button>

                <Button variant={'primary'} className={'w-fit h-fit'} route={'/question/form'}>
                    Frage erstellen
                </Button>

                <Button variant={'primary'} className={'w-fit h-fit'} route={'/questions'}>
                    Alle Fragen anzeigen
                </Button>

                <Button variant={'tertiary'} className={'w-fit h-fit'} onClick={() => sendMessage('Hello from the IU-Quiz-App!', true)}>
                    WebSocket Test
                </Button>
            </div>
        </div>
    );
}

export default Dashboard;