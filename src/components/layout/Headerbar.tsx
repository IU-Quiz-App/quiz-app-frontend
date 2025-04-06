import { FC } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown.tsx";
import {UserIcon} from "@heroicons/react/24/outline";
import {useMsal} from "@azure/msal-react";

const Headerbar: FC = () => {
    const navigate = useNavigate();
    const { instance } = useMsal();

    const handleLogoutRedirect = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: '/',
        })
        window.location.reload();
    }

    return (
        <header className="flex items-center justify-between bg-gradient-to-b from-blue-700 to-blue-900 text-gray-200 px-6 py-3 shadow-lg">

            {/* Left - Logo & Menu */}
            <div className="flex items-center gap-4">
                {/* Dropdown menu */}
                <Dropdown
                    options={[
                        { label: "Startseite", onClick: () => navigate("/dashboard") },
                        { label: "Spiel starten", onClick: () => navigate("/game") },
                        { label: "Frage erstellen", onClick: () => navigate("/question/form") },
                        { label: "Alle Fragen anzeigen", onClick: () => navigate("/questions") },
                    ]}
                    className="px-4 py-2 rounded-md border-2 bg-gradient-to-bl from-blue-400 to-blue-600 border-blue-600 shadow-blue-900 text-$blue-100"
                >
                    Menü
                </Dropdown>

                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src="/iu-quiz-app-logo.png" alt="logo" className="h-12 w-12"/>
                    <span className="ml-0.5 text-lg">uiz-App</span>
                </Link>
            </div>

            {/* Middle - Search Bar */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-blue-300 px-4 py-2 rounded-lg w-1/3">
                <Search className="h-5 w-5 text-gray-200"/>
                <input
                    type="text"
                    placeholder="Suche..."
                    className="bg-transparent placeholder-gray-200 placeholder-opacity-50 text-gray-200 outline-none ml-2 w-full"
                />
            </div>

            {/* Right - User Profile */}
            <div className="flex items-center gap-4">
                <Dropdown
                    options={[
                        { label: "Logout", onClick: () => handleLogoutRedirect() },
                    ]}
                    className="px-4 py-2 rounded-md border-2 bg-gradient-to-bl from-blue-400 to-blue-600 border-blue-600 shadow-blue-900 text-$blue-100"
                >
                    <UserIcon className={'w-6 h-6'}/>
                </Dropdown>
            </div>
        </header>
    );
};

export default Headerbar;
