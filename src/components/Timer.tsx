import { useEffect, useState, useRef } from "react";

interface TimerProps {
    start: boolean;
    seconds: number;
    onFinish?: () => void;
    className?: string;
}

const Timer: React.FC<TimerProps> = ({ start, seconds, onFinish = () => {}, className }) => {
    const [timeLeft, setTimeLeft] = useState(seconds * 1000);
    const [progress, setProgress] = useState(1);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const radius = 20;
    const strokeW = 30;
    const strokeD = Math.PI * 2 * radius;

    const circleLength = 1.0;

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
    }, [start, seconds]);

    return (
        <svg viewBox="0 0 100 100" className={className}>
            <circle
                className={'stroke-white'}
                cx="50"
                cy="50"
                r={radius}
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeWidth={strokeW}
                fill="transparent"
                strokeDashoffset={strokeD - strokeD * circleLength}
                strokeDasharray={strokeD}
            />
            <circle
                className={'stroke-red-300'}
                cx="50"
                cy="50"
                r={radius}
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeWidth={strokeW}
                fill="transparent"
                strokeDashoffset={strokeD - strokeD * progress * circleLength}
                strokeDasharray={strokeD}
            />
            <circle
                className={'stroke-blue-200'}
                cx="50"
                cy="50"
                r={35}
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeWidth={1}
                fill="transparent"
            />
            <circle
                className={'stroke-blue-300'}
                cx="50"
                cy="50"
                r={radius}
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength) - (0.02 * 360 * 0.5) )}deg)`,
                    transformOrigin: "center",
                }}
                strokeWidth={strokeW + 3}
                fill="transparent"
                strokeDashoffset={strokeD - strokeD * 0.02 * circleLength}
                strokeDasharray={strokeD}
            />
            <circle
                className={'stroke-blue-200'}
                cx="50"
                cy="50"
                r={5}
                style={{
                    transform: `rotate(${(-180 - (0.5 * 180 - 180 * circleLength))}deg)`,
                    transformOrigin: "center",
                }}
                strokeWidth={20}
                fill="transparent"
            />
            <text x="50" y="55" textAnchor="middle" fill="black">
                {(timeLeft / 1000).toFixed(0)}
            </text>
        </svg>
    );
};

export default Timer;

