import {ChangeEvent} from "react";
import InputLabel from "./InputLabel.tsx";
import {InputError} from "./InputError.tsx";

interface TextAreaInputProps {
    id: string
    name: string
    label?: string
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
    className?: string
    placeholder?: string
    value?: string
    errorMessage?: string
    required?: boolean
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, name, className, onChange, label, placeholder, value, errorMessage, required }) => {

    return (
        <div className={'flex flex-col w-full gap-2'}>
            {label && <InputLabel id={id} label={label} htmlFor={id} required={required}/>}
            <InputError id={id} message={errorMessage}/>
                <textarea
                    id={id}
                    name={name}
                    className={`resize-none border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent w-full ${className}`}
                    onChange={onChange}
                    placeholder={placeholder}
                    value={value}
                />
        </div>
    )

}

export default TextAreaInput;