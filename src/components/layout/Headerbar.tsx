import {FC, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown.tsx";
import {useMsal} from "@azure/msal-react";
import Button from "@components/Button.tsx";
import Profile from "@components/Profile.tsx";
import {AuthContext} from "../../App.tsx";

const Headerbar: FC = () => {
    const navigate = useNavigate();
    const { instance } = useMsal();

    const { user } = useContext(AuthContext);

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
                >
                    <Button className={'py-1'}>
                        Menü
                    </Button>
                </Dropdown>

                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src="/iu-quiz-app-logo.png" alt="logo" className="h-12 w-12"/>
                    <span className="ml-0.5 text-lg">uiz-App</span>
                </Link>
            </div>

            {/* Right - User Profile */}
            <div className="flex items-center gap-4">
                {user && (
                    <div className={'flex flex-row items-center gap-6'}>
                        <Dropdown
                            options={[
                                { label: "Logout", onClick: () => handleLogoutRedirect() },
                            ]}
                            className="px-4 py-2 rounded-md border-2 bg-gradient-to-bl from-blue-400 to-blue-600 border-blue-600 shadow-blue-900 text-$blue-100"
                        >
                            <Profile user={user} className={'h-10 w-10'}/>
                        </Dropdown>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Headerbar;
