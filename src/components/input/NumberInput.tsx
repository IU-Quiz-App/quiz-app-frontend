import { useState, useEffect, FC } from 'react';

interface QuantityInputProps {
    id: string;
    value: number;
    onQuantityChange: (value: number) => void;
    disabled?: boolean;
}

export const QuantityInput: FC<QuantityInputProps> = ({
                                                          id,
                                                          value,
                                                          onQuantityChange,
                                                          disabled,
                                                      }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = parseInt(event.target.value, -1);
        if (newValue >= 0) {
            onQuantityChange(newValue);
            setLocalValue(newValue);
        }
    }

    function increase() {
        onQuantityChange(localValue + 1);
        setLocalValue(localValue + 1);
    }

    function decrease() {
        onQuantityChange(localValue - 1);
        setLocalValue(localValue - 1);
    }

    return (
        <div className="flex items-center justify-center"
             id={`${id}-quantity-input`}
             data-testid={`${id}-input-quantity`}
        >
            <button
                id={`${id}-quantity-input-decrease`}
                data-testid={`${id}-quantity-input-decrease`}
                onClick={decrease}
                disabled={disabled || localValue <= 0}
                className={
                    'w-10 h-10 relative disabled:opacity-50 disabled:cursor-not-allowed rounded-md border'
                }
            >
                <div className="text-center text-neutral-6 text-2xl font-semibold font-sans uppercase leading-tight flex items-center justify-center">
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
                onChange={handleInputChange}
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
                <div className="text-center text-2xl font-semibold font-sans uppercase leading-tight flex items-center justify-center">
                    +
                </div>
            </button>
        </div>
    );
};

export default QuantityInput;