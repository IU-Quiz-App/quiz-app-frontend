import { FC } from 'react';
import Box from "@components/Box.tsx";
import {getAllGameSessionsByUser} from "@services/Api.ts";
import GameTable from "@pages/quiz/GameTable.tsx";

export const GameTableWrapper: FC = () => {

    return (
        <Box className={'w-full flex-col gap-4 min-h-full !overflow-auto'}>
            <GameTable
                fetchGameSessions={async (page) => {
                    return await getAllGameSessionsByUser(page, 10);
                }}
            />
        </Box>
    );
};

export default GameTableWrapper;