import { FC } from 'react';
import Box from "@components/Box.tsx";
import Button from "@components/Button.tsx";
import {getAllGameSessionsByUser, getUser} from "@services/Api.ts";
import GameTable from "@pages/quiz/GameTable.tsx";

export const GameTableWrapper: FC = () => {

    return (
        <Box className={'w-full flex-col gap-4 min-h-full'}>
            <GameTable
                fetchGameSessions={async (page) => {
                    const user = await getUser();
                    return await getAllGameSessionsByUser(user, page, 10);
                }}
            />
        </Box>
    );
};

export default GameTableWrapper;