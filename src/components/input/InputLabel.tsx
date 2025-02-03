import { FC } from 'react';

interface InputLabelProps {
    id: string;
    label: string;
    htmlFor: string | undefined;
    className?: string;
    required?: boolean;
}

export const InputLabel: FC<InputLabelProps> = ({
    id,
    label,
    className = '',
    htmlFor,
    required = false,
}) => {
    return (
        <label
            id={`${id}-input-label`}
            data-testid={`${id}-input-label`}
            htmlFor={htmlFor}
            className={`block text-sm font-semibold w-full ${className}`}
        >
            {label}
            {required && <span className="text-red-500">{' *'}</span>}
        </label>
    );
};

export default InputLabel;