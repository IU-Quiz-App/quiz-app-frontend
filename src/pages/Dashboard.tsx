import Button from "../components/Button.tsx";

const Dashboard: React.FC = () => {
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
            </div>
        </div>
    );
}

export default Dashboard;