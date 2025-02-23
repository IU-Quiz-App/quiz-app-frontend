import { FC, useState, useEffect, useRef } from "react";
import { Menu, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const Headerbar: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    {/* Event listener, for closing the dropdown menu */}
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="flex items-center justify-between bg-gradient-to-b from-blue-700 to-blue-900 text-gray-200 px-6 py-3 shadow-lg">

            {/* Left - Logo & Menu */}
            <div className="flex items-center gap-4">
                <button ref={menuButtonRef} className="relative p-2 rounded-lg hover:bg-blue-300" onClick={toggleMenu}>
                    <Menu className="h-6 w-6"/>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                    <div ref={dropdownRef} className="absolute left-2 top-20 mt-1 bg-blue-700 text-white rounded-lg w-48 shadow-lg">
                        <ul className="flex flex-col">
                            <li>
                                <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-300" onClick={handleLinkClick}>
                                    Startseite
                                </Link>
                            </li>
                            <li>
                                <Link to="/quiz/question" className="block px-4 py-2 hover:bg-blue-300" onClick={handleLinkClick}>
                                    Spiel starten
                                </Link>
                            </li>
                            <li>
                                <Link to="/question/form" className="block px-4 py-2 hover:bg-blue-300" onClick={handleLinkClick}>
                                    Frage erstellen
                                </Link>
                            </li>
                            <li>
                                <Link to="/questions" className="block px-4 py-2 hover:bg-blue-300" onClick={handleLinkClick}>
                                    Alle Fragen anzeigen
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}

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
                <button className="p-2 rounded-lg hover:bg-blue-300">
                    <User className="h-6 w-6"/>
                </button>
            </div>
        </header>
    );
};

export default Headerbar;
