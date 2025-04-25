import {useNavigate} from "react-router-dom";


interface ButtonProps {
    children?: React.ReactNode
    onClick?: () => void
    className?: string
    route?: string
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'tertiary'
    color?: 'pink' | 'orange' | 'blue' | 'red' | 'cyan' | 'yellow' | 'green'
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, route, color = 'blue', variant = 'primary', disabled = false}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (route) {
            navigate(route)
        }

        if (onClick) {
            onClick()
        }
    }

    const variantClasses = (variant: string) => {
        switch (variant) {
            case 'primary':
                return `bg-gradient-to-bl from-${color}-200 to-${color}-400 border-${color}-200 shadow-${color}-800 text-${color}-50`
            case 'secondary':
                return `bg-gradient-to-bl from-${color}-400 to-${color}-600 border-${color}-600 shadow-${color}-900 text-${color}-100`
            case 'tertiary':
                return `bg-${color}-100 enabled:hover:bg-${color}-200 border-${color}-200 enabled:hover:border-${color}-300 shadow-${color}-300 text-${color}-500`
        }
    }

    return (
        <button
            disabled={disabled}
            onClick={handleClick}
            className={`font-normal enabled:cursor-pointer flex items-center justify-center border-2 rounded-md h-fit w-fit p-4 shadow-md overflow-hidden ${variantClasses(variant)} ${className}`}
        >
            {children}
        </button>
    )

}

export default Button;