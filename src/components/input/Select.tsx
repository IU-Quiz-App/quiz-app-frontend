import {ChangeEvent} from "react";
import InputLabel from "./InputLabel.tsx";
import {InputError} from "./InputError.tsx";

interface TextInputProps {
    id: string
    name: string
    options: { value: string | number | readonly string[] | undefined, label: string }[]
    label?: string
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
    className?: string
    placeholder?: string
    value?: string
    errorMessage?: string
    required?: boolean
}

const Select: React.FC<TextInputProps> = ({ id, name, options, className, onChange, label, placeholder, value, errorMessage, required }) => {

    return (
            <div className={'flex flex-col grow'}>
                {label && <InputLabel id={id} label={label} htmlFor={id} required={required} className={'mb-2'}/>}
                <InputError id={id} message={errorMessage}/>
                <select
                    id={id}
                    name={name}
                    className={`border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-gray-500 ${className}`}
                    onChange={onChange}
                    value={value}
                >
                    {placeholder && <option value={''} className={'bg-yellow-200'}>
                        {placeholder}
                    </option>}

                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
    )

}

export default Select;