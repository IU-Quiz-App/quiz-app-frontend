import {ChangeEvent} from "react";
import InputLabel from "./InputLabel.tsx";
import {InputError} from "./InputError.tsx";

interface TextInputProps {
    id: string
    name: string
    label?: string
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder?: string
    value?: string
    errorMessage?: string
    required?: boolean
}

const TextInput: React.FC<TextInputProps> = ({ id, name, className, onChange, label, placeholder, value, errorMessage, required }) => {

    return (
        <div className={'flex flex-col w-full'}>
            <InputError id={id} message={errorMessage}/>
            <div className={'flex flex-col w-full gap-2'}>
                {label && <InputLabel id={id} label={label} htmlFor={id} required={required}/>}

                <input
                    id={id}
                    name={name}
                    className={`border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${className}`}
                    onChange={onChange}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
        </div>
    )

}

export default TextInput;