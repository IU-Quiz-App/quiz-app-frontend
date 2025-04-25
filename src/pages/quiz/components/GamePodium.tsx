import { User } from "@services/Types.ts";
import {useEffect, useState} from "react";
import Profile from "@components/Profile.tsx";
import tippy from "tippy.js";
import confetti from 'canvas-confetti';

interface GamePodiumProps {
    users: User[],
    showPodium?: boolean,
    className?: string,
    startAnimation?: boolean,
    secondsPerStep?: number,
}

const GamePodium: React.FC<GamePodiumProps> = ({ users, showPodium = true, className = '', startAnimation = false, secondsPerStep = 1 }) => {
    const [firstPlace, setFirstPlace] = useState<User | undefined>(undefined);
    const [secondPlace, setSecondPlace] = useState<User | undefined>(undefined);
    const [thirdPlace, setThirdPlace] = useState<User | undefined>(undefined);

    const [showFirstPlace, setShowFirstPlace] = useState<{bar: boolean, profile: boolean}>({bar: false, profile: false});
    const [showSecondPlace, setShowSecondPlace] = useState<{bar: boolean, profile: boolean}>({bar: false, profile: false});
    const [showThirdPlace, setShowThirdPlace] = useState<{bar: boolean, profile: boolean}>({bar: false, profile: false});

    useEffect(() => {
        if (!users || users.length === 0) {
            return;
        }

        users.forEach((user, index) => {
            switch (index) {
                case 0:
                    setFirstPlace(user);
                    break;
                case 1:
                    setSecondPlace(user);
                    break;
                case 2:
                    setThirdPlace(user);
                    break;
            }

           if (index > 2) {
                return;
           }
        });
    }, [users]);

    useEffect(() => {
        if (startAnimation) {
            animatePodium();
        }
    }, [startAnimation]);

    async function animatePodium() {
        const delay = (s: number) => new Promise(resolve => setTimeout(resolve, s*1000));

        setShowThirdPlace({bar: true, profile: false});
        await delay(secondsPerStep);
        setShowSecondPlace({bar: true, profile: false});
        await delay(secondsPerStep);
        setShowFirstPlace({bar: true, profile: false});
        await delay(secondsPerStep);
        setShowThirdPlace({bar: true, profile: true});
        showPopover('third');
        await delay(secondsPerStep);
        setShowSecondPlace({bar: true, profile: true});
        showPopover('second');
        await delay(secondsPerStep);
        setShowFirstPlace({bar: true, profile: true});
        showPopover('first');

        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            zIndex: 9999,
        });
    };

    function showPopover(place: 'first' | 'second' | 'third') {
        let user: User | undefined;

        switch (place) {
            case 'first':
                user = firstPlace;
                break;
            case 'second':
                user = secondPlace;
                break;
            case 'third':
                user = thirdPlace;
                break;
        }

        if (!user) {
            return;
        }

        const elementId = `${place}-place-profile`;
        const el = document.getElementById(elementId);
        if (!el) {
            return;
        }
        // @ts-ignore
        el._tippy?.destroy();


        tippy(el, {
                    animation: 'shift-away-subtle',
                    placement: 'top',
                    theme: 'light',
                    allowHTML: true,
                    content: user?.nickname
                });
    }

    const maxBarHeight = 200;
    const getBarHeight = (score: number | undefined): number =>
        score ? (score / Math.max(firstPlace?.score || 1, 1)) * maxBarHeight : 0;



    return (
        <>
            <svg viewBox="0 0 300 250" className={className}>
                <defs>
                    <linearGradient id="thirdPlaceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e07" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <linearGradient id="firstPlaceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <linearGradient id="secondPlaceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffdd" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>

                    <clipPath id={'thirdPlaceClipPath'}>
                        <rect
                            x="20"
                            y={250 - (showThirdPlace.bar ? getBarHeight(thirdPlace?.score) : 0)}
                            rx={5}
                            ry={5}
                            width={80}
                            style={{ transition: `all ${secondsPerStep}s ease`}}
                            height={300}
                        />
                    </clipPath>

                    <clipPath id={'firstPlaceClipPath'}>
                        <rect
                            x="110"
                            y={250 - (showFirstPlace.bar ? getBarHeight(firstPlace?.score) : 0)}
                            rx={5}
                            ry={5}
                            width={80}
                            style={{ transition: `all ${secondsPerStep}s ease` }}
                            height={300}
                        />
                    </clipPath>

                    <clipPath id={'secondPlaceClipPath'}>
                        <rect
                            x="200"
                            y={250 - (showSecondPlace.bar ? getBarHeight(secondPlace?.score) : 0)}
                            rx={5}
                            ry={5}
                            width={80}
                            style={{ transition: `all ${secondsPerStep}s ease` }}
                            height={300}
                        />
                    </clipPath>
                </defs>
                {showPodium && (
                    <>
                        {/* Third place - left bar */}
                        {thirdPlace &&
                            <>
                                <rect
                                    x="20"
                                    y={250 - getBarHeight(thirdPlace?.score)}
                                    width={80}
                                    fill="url(#thirdPlaceGradient)"
                                    height={getBarHeight(thirdPlace?.score)}
                                    clipPath={`url(#thirdPlaceClipPath)`}
                                />
                                <foreignObject
                                    x="35"
                                    y={250 - (showThirdPlace.bar ? getBarHeight(thirdPlace?.score) : 0) - 60}
                                    width={50}
                                    height={50}
                                    opacity={showThirdPlace.profile ? 1 : 0}
                                    style={{ transition: `all ${secondsPerStep}s ease` }}
                                >
                                    <Profile user={thirdPlace} id={'third-place-profile'} />
                                </foreignObject>
                            </>
                        }

                        {/* First place - middle bar */}
                        {firstPlace &&
                            <>
                                <rect
                                    x="110"
                                    y={250 - getBarHeight(firstPlace.score)}
                                    width={80}
                                    fill="url(#firstPlaceGradient)"
                                    height={getBarHeight(firstPlace.score)}
                                    clipPath={`url(#firstPlaceClipPath)`}
                                />
                                <foreignObject
                                    x="125"
                                    y={250 - (showFirstPlace.bar ? getBarHeight(firstPlace?.score) : 0) - 60}
                                    width={50}
                                    height={50}
                                    opacity={showFirstPlace.profile ? 1 : 0}
                                    className={'fill-amber-200'}
                                    style={{ transition: `all ${secondsPerStep}s ease` }}
                                >
                                    <Profile user={firstPlace} id={'first-place-profile'} />
                                </foreignObject>
                            </>
                        }

                        {/* Second place - right bar */}
                        {secondPlace &&
                            <>
                                <rect
                                    x="200"
                                    y={250 - getBarHeight(secondPlace?.score)}
                                    width={80}
                                    fill="url(#secondPlaceGradient)"
                                    height={getBarHeight(secondPlace?.score)}
                                    clipPath={`url(#secondPlaceClipPath)`}
                                />
                                <foreignObject
                                    x="215"
                                    y={250 - (showSecondPlace.bar ? getBarHeight(secondPlace?.score) : 0) - 60}
                                    width={50}
                                    height={50}
                                    opacity={showSecondPlace.profile ? 1 : 0}
                                    style={{ transition: `all ${secondsPerStep}s ease` }}
                                >
                                    <Profile user={secondPlace} id={'second-place-profile'} />
                                </foreignObject>
                            </>
                        }
                    </>
                )}
            </svg>
        </>
    );
};

export default GamePodium;