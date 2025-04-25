import { User } from "@services/Types.ts";
import {useEffect, useState} from "react";
import Profile from "@components/Profile.tsx";
import tippy from "tippy.js";

interface GamePodiumProps {
    users: User[],
    showPodium?: boolean,
    className?: string,
    startAnimation?: boolean,
}

const GamePodium: React.FC<GamePodiumProps> = ({ users, showPodium = true, className = '', startAnimation = false }) => {
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
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        await delay(100);
        setShowThirdPlace({bar: true, profile: false});
        await delay(3000);
        setShowSecondPlace({bar: true, profile: false});
        await delay(3000);
        setShowFirstPlace({bar: true, profile: false});
        await delay(3000);
        setShowThirdPlace({bar: true, profile: true});
        showPopover('third');
        await delay(3000);
        setShowSecondPlace({bar: true, profile: true});
        showPopover('second');
        await delay(3000);
        setShowFirstPlace({bar: true, profile: true});
        showPopover('first');
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
                {showPodium && (
                    <>
                        {/* Third place - left bar */}
                        {thirdPlace &&
                            <>
                                <rect
                                    x="20"
                                    y={250 - (showThirdPlace.bar ? getBarHeight(thirdPlace?.score) : 0)}
                                    width={80}
                                    className={'fill-amber-700'}
                                    style={{ transition: 'all 3s ease'}}
                                    height={showThirdPlace.bar ? getBarHeight(thirdPlace?.score) : 0}
                                />
                                <foreignObject
                                    x="35"
                                    y={250 - (showThirdPlace.bar ? getBarHeight(thirdPlace?.score) : 0) - 60}
                                    width={50}
                                    height={50}
                                    opacity={showThirdPlace.profile ? 1 : 0}
                                    style={{ transition: 'all 3s ease' }}
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
                                    y={250 - (showFirstPlace.bar ? getBarHeight(firstPlace.score) : 0)}
                                    width={80}
                                    className={'fill-amber-200'}
                                    style={{ transition: 'all 3s ease' }}
                                    height={showFirstPlace.bar ? getBarHeight(firstPlace.score) : 0}
                                />
                                <foreignObject
                                    x="125"
                                    y={250 - (showFirstPlace.bar ? getBarHeight(firstPlace?.score) : 0) - 60}
                                    width={50}
                                    height={50}
                                    opacity={showFirstPlace.profile ? 1 : 0}
                                    className={'fill-amber-200'}
                                    style={{ transition: 'all 3s ease' }}
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
                                    y={250 - (showSecondPlace.bar ? getBarHeight(secondPlace?.score) : 0)}
                                    width={80}
                                    className={'fill-amber-50'}
                                    style={{ transition: 'all 3s ease' }}
                                    height={showSecondPlace.bar ? getBarHeight(secondPlace?.score) : 0}
                                />
                                <foreignObject
                                    x="215"
                                    y={250 - (showSecondPlace.bar ? getBarHeight(secondPlace?.score) : 0) - 60}
                                    width={50}
                                    height={50}
                                    opacity={showSecondPlace.profile ? 1 : 0}
                                    style={{ transition: 'all 3s ease' }}
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