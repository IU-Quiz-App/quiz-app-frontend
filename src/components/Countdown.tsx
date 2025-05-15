import { useEffect, useState, useRef } from "react";

interface CountdownProps {
    start?: boolean;
    seconds: number;
    onFinish?: () => void;
    className?: string;
}

const Countdown: React.FC<CountdownProps> = ({ start = true, seconds, onFinish = () => {}, className }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [scale, setScale] = useState(1);

    const [ended, setEnded] = useState(false);

    useEffect(() => {
        if (!start) return;

        setTimeLeft(seconds * 1000);
        startTimeRef.current = performance.now();

        const updateTimer = () => {
            if (!startTimeRef.current) return;

            const elapsed = performance.now() - startTimeRef.current + 250;
            const newTimeLeft = Math.max((seconds + 1) * 1000 - elapsed, 0);

            const newSeconds = Math.floor(newTimeLeft / 1000);
            const scale = ((newTimeLeft - newSeconds * 1000) / 1000) * 0.5 + 0.5;
            setScale(scale);

            if (newSeconds < 1) {
                setEnded(true);
            } else {
                setTimeLeft(Math.min(newSeconds, seconds));
            }


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
        <svg viewBox="0 0 5 5" textAnchor="middle" className={className}>
            <text
                x={2.5} y={2.5}
                fontSize={3 * scale}
            >
                {!ended && timeLeft}
            </text>
        </svg>
    );
};

export default Countdown;

