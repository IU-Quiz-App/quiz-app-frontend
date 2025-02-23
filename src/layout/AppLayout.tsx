import {Outlet} from "react-router-dom";
import Headerbar from "@components/layout/Headerbar.tsx";

interface AppLayoutProps {
    children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = () => {

    return (
        <main
            className="h-full flex-1 flex flex-row overflow-hidden overflow-x-clip fixed w-full font-semibold font-sans"

        >
            <div className={'flex flex-col w-full backdrop-blur-sm'}>
                <Headerbar/>
                <div className={'absolute w-full h-full -z-10 bg-cover bg-center bg-no-repeat blur-sm'}
                    style={{ backgroundImage: "url('/background.webp')" }}
                />
                <div className={'overflow-scroll grow py-24 px-32'}>
                    <Outlet/>
                </div>
            </div>
        </main>
    )
}

export default AppLayout