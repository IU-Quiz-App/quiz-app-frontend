import Table from '@components/table/Table';
import {GameSession} from "@services/Types.ts";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {EyeIcon} from "@heroicons/react/24/outline";

interface GameTableProps {
    fetchGameSessions: (page: number) => Promise<GameSession[]>;
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

    return (
        <Table
            queryKey={'gameSession'}
            fetchData={fetchGameSessions}
            columns={[
                { accessorKey: 'uuid', header: 'UUID' },
                { header: 'Aktion', cell: ({ row }) => renderActions(row.original) },
            ]}
        />
    );
}

export default GameTable;