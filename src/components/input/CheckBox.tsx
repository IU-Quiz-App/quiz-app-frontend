import { ChangeEvent } from "react";

interface CheckBoxProps {
    id: string
    name: string
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    checked?: boolean
}

const CheckBox: React.FC<CheckBoxProps> = ({ id, name, onChange, checked }) => {
    if (typeof checked === "string") {
        checked = checked === "true";
    }

    if (typeof checked === "undefined") {
        checked = false;
    }

    return (
        <input
            id={id}
            name={name}
            onChange={onChange}
            checked={checked}
            type="checkbox"
        />
    )
}

export default CheckBox