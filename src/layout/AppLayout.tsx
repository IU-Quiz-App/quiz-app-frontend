import {Link, Outlet} from "react-router-dom";

interface AppLayoutProps {
    children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = () => {

    return (
        <main
            className="h-full flex flex-row overflow-hidden bg-purple-50 overflow-x-clip fixed w-full font-semibold font-mono"
        >
            <div className={'flex flex-col w-full'}>
                <div className={'flex h-24 bg-gradient-to-b from-blue-400 to-blue-500 w-full p-4 items-center'}>
                    <Link to={'/'}>
                        <span className={'text-white'}>
                            Quiz-App
                        </span>
                    </Link>
                </div>
                <div className={'overflow-scroll grow p-8'}>
                <Outlet />
                </div>
            </div>
        </main>
    )
}

export default AppLayout
