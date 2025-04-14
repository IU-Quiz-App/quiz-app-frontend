import {User} from "@services/Types.ts";
import {useEffect, useState} from "react";

interface ProfileProps {
    user: User;
    onClick?: () => void
    className?: string
}

const Profile: React.FC<ProfileProps> = ({ user, onClick, className }) => {

    const [color, setColor] = useState<string>('');

    useEffect(() => {
        const hexColor = getColorFromUUID(user.user_uuid);
        setColor(hexColor);
    }, [user.user_uuid]);

    function getColorFromUUID(uuid: string): string {
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Convert the hash into RGB values
        const r = (hash >> 16) & 0xff;
        const g = (hash >> 8) & 0xff;
        const b = hash & 0xff;

        // Ensure positive values
        const toHex = (value: number) => {
            const hex = (value & 0xff).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function darkenHex(hex: string, percent: number): string {
        // Ensure percent is between 0 and 100
        percent = Math.min(Math.max(percent, 0), 100);

        // Remove "#" if present
        hex = hex.replace(/^#/, "");

        // Expand short hex (e.g. "abc") to full form (e.g. "aabbcc")
        if (hex.length === 3) {
            hex = hex.split("").map(c => c + c).join("");
        }

        const num = parseInt(hex, 16);

        let r = (num >> 16) & 0xff;
        let g = (num >> 8) & 0xff;
        let b = num & 0xff;

        r = Math.floor(r * (1 - percent / 100));
        g = Math.floor(g * (1 - percent / 100));
        b = Math.floor(b * (1 - percent / 100));

        const toHex = (v: number) => v.toString(16).padStart(2, "0");

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    return (
        <svg className={className} onClick={onClick} viewBox="0 0 50 50">
            <defs>
                <linearGradient id="gradient-profile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={darkenHex(color, 50)} />
                </linearGradient>

                <clipPath id="clip-path-profile">
                    <circle
                        cx="25"
                        cy="25"
                        r={25}
                    />
                </clipPath>
            </defs>

            <rect
                height={50}
                width={50}
                fill={`url(#gradient-profile)`}
                clipPath="url(#clip-path-profile)"
            />

            <text x="50%" y="54%" fill="white" textAnchor="middle" strokeWidth="2px" dy=".3em"
                  fontSize="40"
            >
                {user.nickname.charAt(0).toUpperCase()}
            </text>
        </svg>
    );

}

export default Profile;