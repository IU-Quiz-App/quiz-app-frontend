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
    type?: string
}

const TextInput: React.FC<TextInputProps> = ({ id, name, className, onChange, label, placeholder, value, errorMessage, required, type }) => {

    return (
            <div className={'flex flex-col'}>
                {label && <InputLabel id={id} label={label} htmlFor={id} required={required} className={'mb-2'}/>}
                <InputError id={id} message={errorMessage}/>
                <input
                    id={id}
                    name={name}
                    type={type ?? 'text'}
                    className={`border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-500 ${className}`}
                    onChange={onChange}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
    )

}

export default TextInput;