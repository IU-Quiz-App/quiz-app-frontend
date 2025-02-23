
interface BoxProps {
    children?: React.ReactNode
    onClick?: () => void
    className?: string
    color?: 'pink' | 'orange' | 'blue' | 'red' | 'cyan' | 'yellow' | 'green'
}

const Box: React.FC<BoxProps> = ({ children, onClick, className, color = 'gray' }) => {

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
    }

    return (
        <div
            onClick={handleClick}
            className={`bg-gradient-to-bl border-2 rounded-md h-fit w-fit p-4 shadow-md overflow-hidden bg-opacity-50 backdrop-blur-lg bg-${color}-100 border-${color}-200 shadow-${color}-300 text-${color}-500 ${className}`}
        >
            {children}
        </div>
    )

}

export default Box;