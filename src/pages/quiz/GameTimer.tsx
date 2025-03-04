import { useEffect, useState, useRef } from "react";

interface GameTimerProps {
    start: boolean;
    seconds: number;
    onFinish: () => void;
    className?: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ start, seconds, onFinish, className }) => {
    const [timeLeft, setTimeLeft] = useState(seconds * 1000);
    const [progress, setProgress] = useState(1);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const radius = 40;
    const strokeD = Math.PI * 2 * radius;
    const circleLength = 0.5;

    useEffect(() => {
        if (!start) return;

        setTimeLeft(seconds * 1000);
        setProgress(1);
        startTimeRef.current = performance.now();

        const updateTimer = () => {
            if (!startTimeRef.current) return;

            const elapsed = performance.now() - startTimeRef.current;
            const newTimeLeft = Math.max(seconds * 1000 - elapsed, 0);

            setTimeLeft(newTimeLeft);
            setProgress(newTimeLeft / (seconds * 1000));

            if (newTimeLeft > 0) {
                animationFrameRef.current = requestAnimationFrame(updateTimer);
            } else {
                onFinish();
            }
        };

        animationFrameRef.current = requestAnimationFrame(updateTimer);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [start, seconds, onFinish]);

    return (
        <svg viewBox="0 0 100 100" className={className}>
            <circle
                className={'stroke-blue-200'}
                cx="50"
                cy="50"
                r="40"
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeLinecap="round"
                strokeWidth="20"
                fill="transparent"
                strokeDashoffset={strokeD - strokeD * circleLength}
                strokeDasharray={strokeD}
            />
            <circle
                className={'stroke-white'}
                cx="50"
                cy="50"
                r="40"
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeLinecap="round"
                strokeWidth="17"
                fill="transparent"
                strokeDashoffset={strokeD - strokeD * circleLength}
                strokeDasharray={strokeD}
            />
            <circle
                className={'stroke-red-300'}
                cx="50"
                cy="50"
                r="40"
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeLinecap="round"
                strokeWidth="17"
                fill="transparent"
                strokeDashoffset={strokeD - strokeD * progress * circleLength}
                strokeDasharray={strokeD}
            />
            <text x="50" y="50" textAnchor="middle" fill="black">
                {(timeLeft / 1000).toFixed(2)}
            </text>
        </svg>
    );
};

export default GameTimer;

