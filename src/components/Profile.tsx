import {User} from "@services/Types.ts";

interface ProfileProps {
    user: User;
    onClick?: () => void
    className?: string
    [key: string]: any;
}

const Profile: React.FC<ProfileProps> = ({ user, onClick, className, ...props }) => {

    function getColorFromUUID(uuid: string): string {
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
        }

        const getComponent = (mod: number, offset: number) =>
            Math.abs((hash >> offset) % mod);

        const high = 255;
        const medium = 60 + getComponent(70, 8);
        const low = 30 + getComponent(60, 0);

        const combos = [
            [high, medium, low],
            [high, low, medium],
            [medium, high, low],
            [low, high, medium],
            [medium, low, high],
            [low, medium, high],
        ];

        const [r, b, g] = combos[Math.abs(hash) % combos.length];

        const toHex = (value: number) => {
            const hex = value.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function darkenHex(hex: string, percent: number): string {
        percent = Math.min(Math.max(percent, 0), 100);

        hex = hex.replace(/^#/, "");

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
        <svg className={className} onClick={onClick} viewBox="0 0 50 50" {...props}>
            <defs>
                <linearGradient id={`gradient-profile-${user.user_uuid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={getColorFromUUID(user.user_uuid)} />
                    <stop offset="100%" stopColor={darkenHex(getColorFromUUID(user.user_uuid), 50)} />
                </linearGradient>

                <clipPath id={`clip-path-profile-${user.user_uuid}`}>
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
                fill={`url(#gradient-profile-${user.user_uuid})`}
                clipPath={`url(#clip-path-profile-${user.user_uuid})`}
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