import Button from "../components/Button.tsx";

const Dashboard: React.FC = () => {

    return (
        <div className={'w-full flex items-center justify-center h-full gap-6'}>
            <Button variant={'secondary'} className={'w-fit h-fit'} route={'/quiz/question'}>
                Spiel starten
            </Button>

            <Button variant={'primary'} className={'w-fit h-fit'} route={'/question/form'}>
                Frage erstellen
            </Button>
        </div>
    )

}

export default Dashboard;