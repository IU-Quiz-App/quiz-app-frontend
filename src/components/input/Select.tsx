import {ChangeEvent} from "react";
import InputLabel from "./InputLabel.tsx";
import {InputError} from "./InputError.tsx";

interface TextInputProps {
    id: string
    name: string
    options: { value: string, label: string }[]
    label?: string
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
    className?: string
    placeholder?: string
    value?: string
    errorMessage?: string
    required?: boolean
}

const TextInput: React.FC<TextInputProps> = ({ id, name, options, className, onChange, label, placeholder, value, errorMessage, required }) => {

    return (
        <div className={'flex flex-col w-full'}>
            <InputError id={id} message={errorMessage}/>
            <div className={'flex flex-col w-full gap-2'}>
                {label && <InputLabel id={id} label={label} htmlFor={id} required={required}/>}
                <select
                    id={id}
                    name={name}
                    className={`border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${className}`}
                    onChange={onChange}
                    value={value}
                >
                    <option value={''} className={'bg-yellow-200'}>
                        {placeholder ?? 'Bitte auswählen'}
                    </option>

                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )

}

export default TextInput;