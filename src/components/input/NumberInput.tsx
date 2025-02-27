import {useState, useEffect, FC, ChangeEvent} from 'react';
import InputLabel from "@components/input/InputLabel.tsx";
import {InputError} from "@components/input/InputError.tsx";

interface NumberInputProps {
    id: string;
    name: string;
    value: number;
    label?: string;
    min?: number;
    errorMessage?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean;
}

export const NumberInput: FC<NumberInputProps> = ({
                                                          id,
                                                          value,
                                                          name,
                                                          label,
                                                          min = 1,
                                                          errorMessage,
                                                          onChange,
                                                          disabled,
                                                      }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    function increase() {
        const newValue = localValue + 1;
        setLocalValue(newValue);
        triggerChangeEvent(newValue);
    }

    function decrease() {
        const newValue = localValue - 1;
        setLocalValue(newValue);
        triggerChangeEvent(newValue);
    }

    function triggerChangeEvent(newValue: number) {
        const event = {
            target: { value: newValue.toString() }
        } as ChangeEvent<HTMLInputElement>;
        onChange(event);
    }

    return (
        <div className={'flex flex-col w-full'}>
            <InputError id={`${id}-quantity-input-field`} message={errorMessage}/>
            {label && (
                <InputLabel id={id} label={label} htmlFor={name} required={false}/>
            )}
            <div className="flex items-center justify-center"
                 id={`${id}-quantity-input`}
                 data-testid={`${id}-input-quantity`}
            >
                <button
                    id={`${id}-quantity-input-decrease`}
                    data-testid={`${id}-quantity-input-decrease`}
                    onClick={decrease}
                    disabled={disabled || localValue <= min}
                    className={
                        'w-10 h-10 relative disabled:opacity-50 disabled:cursor-not-allowed rounded-md border'
                    }
                >
                    <div
                        className="text-center text-neutral-6 text-2xl font-semibold font-sans uppercase leading-tight flex items-center justify-center">
                        −
                    </div>
                </button>

                <input
                    id={`${id}-quantity-input-field`}
                    data-testid={`${id}-quantity-input-field`}
                    className={`w-24 p-0 flex bg-transparent border-0 active:border-0 text-sm text-center font-semibold font-sans active:ring-0 focus:ring-0 focus-visible:outline-0 ${
                        disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    type="text"
                    value={localValue}
                    onChange={onChange}
                    disabled={disabled}
                />

                <button
                    id={`${id}-quantity-input-increase`}
                    data-testid={`${id}-quantity-input-increase`}
                    onClick={increase}
                    disabled={disabled}
                    className={
                        'w-10 h-10 relative disabled:opacity-50 disabled:cursor-not-allowed rounded-md border'
                    }
                >
                    <div
                        className="text-center text-2xl font-semibold font-sans uppercase leading-tight flex items-center justify-center">
                        +
                    </div>
                </button>
            </div>
        </div>
    );
};

export default NumberInput;