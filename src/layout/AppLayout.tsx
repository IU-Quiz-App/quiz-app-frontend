import {Link, Outlet} from "react-router-dom";
import config from "../services/Config.ts";

interface AppLayoutProps {
    children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = () => {

    return (
        <main
            className="h-full flex flex-row overflow-hidden bg-purple-50 overflow-x-clip fixed w-full font-semibold font-sans"
        >
            <div className={'flex flex-col w-full'}>
                <div className={'flex h-24 bg-gray-700 p-4 items-center'}>
                    <Link to={'/'} className={'flex flex-row items-center' }>
                        <img src={`${config.BaseUrl}iu-quiz-app-logo.png`} alt={'logo'} className={'h-16 w-16'} />
                        <span className={'text-white'}>
                            uiz-App
                        </span>
                    </Link>
                </div>
                <div className={'overflow-scroll grow py-8 px-24'}>
                <Outlet />
                </div>
            </div>
        </main>
    )
}

export default AppLayout
