import Table from '@components/table/Table';
import {GameSession} from "@services/Types.ts";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {EyeIcon} from "@heroicons/react/24/outline";
import Loader from "@components/Loader.tsx";
import {formatDate} from "@services/Utils.ts";

interface GameTableProps {
    fetchGameSessions: (page: number, pageSize: number) => Promise<{items: GameSession[], total: number}>;
}

const GameTable: FC<GameTableProps> = ({ fetchGameSessions }) => {

    const navigate = useNavigate();

    const renderActions = (game: GameSession) => {
        return (
            <div className="flex space-x-2">
                <EyeIcon
                    className={'cursor-pointer text-primary-3 w-5 h-5'}
                    onClick={() => navigate(`/game/${game.uuid}`)}
                />
            </div>
        )
    }

    const renderEndedAt = (game: GameSession) => {
        if (game.ended_at) {
            return game.ended_at
        }

        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-6'} />
            </div>
        )
    }



    return (
        <Table
            queryKey={'gameSession'}
            fetchData={fetchGameSessions}
            columns={[
                { accessorKey: 'uuid', header: 'UUID' },
                { accessorKey: 'created_at', header: 'Erstellt am', cell: ({ row }) => formatDate((row.original as GameSession).created_at) },
                { accessorKey: 'started_at', header: 'Gestartet am', cell: ({ row }) => formatDate((row.original as GameSession).started_at) },
                { header: 'Beendet am', cell: ({ row }) => renderEndedAt((row.original as GameSession)) },
                { header: 'Aktion', cell: ({ row }) => renderActions((row.original as GameSession)) },
            ]}
        />
    );
}

export default GameTable;