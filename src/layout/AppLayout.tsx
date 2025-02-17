import {Outlet} from "react-router-dom";
import Headerbar from "@components/layout/Headerbar.tsx";

interface AppLayoutProps {
    children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = () => {

    return (
        <main
            className="h-full flex flex-row overflow-hidden bg-purple-50 overflow-x-clip fixed w-full font-semibold font-sans"
        >
            <div className={'flex flex-col w-full'}>
                <Headerbar />
                <div className={'overflow-scroll grow py-8 px-24'}>
                <Outlet />
                </div>
            </div>
        </main>
    )
}

export default AppLayout