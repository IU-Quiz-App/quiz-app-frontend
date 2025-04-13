import { useEffect, useState, useRef } from "react";

interface GameProgressBarProps {
    start: boolean;
    seconds: number;
    onFinish?: () => void;
    className?: string;
    width?: number;
    height?: number;
}

const GameProgressBar: React.FC<GameProgressBarProps> = ({ start, seconds, onFinish = () => {}, className, width = 100, height = 10 }) => {
    const [progress, setProgress] = useState(1);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!start) return;
        setProgress(1);
        startTimeRef.current = performance.now();

        const updateTimer = () => {
            if (!startTimeRef.current) return;

            const elapsed = performance.now() - startTimeRef.current;
            const newTimeLeft = Math.max(seconds * 1000 - elapsed, 0);

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
            <defs>
                <clipPath id="clip-path-border">
                    <rect
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        rx="2.5"
                        ry="2.5"
                    />
                </clipPath>

                <clipPath id="clip-path">
                    <rect
                        x="0.3"
                        y="0.3"
                        width={width - 0.6}
                        height={height - 0.6}
                        rx="2.2"
                        ry="2.2"
                    />
                </clipPath>
            </defs>

            <rect
                className={'fill-blue-200'}
                width={width}
                height={height}
                clip-path="url(#clip-path-border)"
            />

            <rect
                className={'fill-gray-200'}
                width={width}
                height={height}
                clip-path="url(#clip-path)"
            />

            <rect
                className={'fill-blue-200'}
                width={width * progress}
                height={height}
                clip-path="url(#clip-path)"
            />
        </svg>
    );
};

export default GameProgressBar;

