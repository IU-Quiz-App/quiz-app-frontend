import Button from "../components/Button.tsx";

const Dashboard: React.FC = () => {

    return (
        <div className={'w-full flex items-center justify-center h-full'}>
            <Button variant={'secondary'} className={'w-fit h-fit'} route={'/question'}>
                Spiel starten
            </Button>
        </div>
    )

}

export default Dashboard;