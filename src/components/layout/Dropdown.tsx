import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

interface DropdownProps {
    children: React.ReactNode;
    options: { label: string; onClick: () => void }[];
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ children, options, className }) => {
    const [visible, setVisible] = useState(false);

    return (
        <Tippy
            visible={visible}
            onClickOutside={() => setVisible(false)}
            interactive={true}
            animation="shift-away"
            theme="transparent"
            content={
                <div className="bg-blue-600 border rounded-md shadow-md p-2 w-48">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className="block w-full text-left px-4 py-2 bg-gradient-to-bl from-blue-200 to-blue-400 border-blue-200 shadow-blue-800 text-blue-50"
                            onClick={() => {
                                option.onClick();
                                setVisible(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            }
        >
            <button onClick={() => setVisible(!visible)} className={className}>
                {children}
            </button>
        </Tippy>
    );
};

export default Dropdown;