import Table from '@components/table/Table';
import {Course, GameSession } from "@services/Types.ts";
import {FC, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {EyeIcon} from "@heroicons/react/24/outline";
import Loader from "@components/Loader.tsx";
import {formatDate} from "@services/Utils.ts";
import {Popover} from "@components/Popover.tsx";
import Profile from "@components/Profile.tsx";
import {getAllCourses} from "@services/Api.ts";

interface GameTableProps {fetchGameSessions: (page: number, pageSize: number) => Promise<{items: GameSession[], total: number}>;
}

const GameTable: FC<GameTableProps> = ({ fetchGameSessions }) => {

    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getAllCourses();
                setAllCourses(courses);
            } catch (error) {
                console.error('Error fetching courses', error);
            }
        };

        fetchCourses();
    }, []);


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
            return formatDate(game.ended_at);
        }

        return (
            <div className={'w-full h-full flex items-center justify-center'}>
                <Loader className={'w-6'} />
            </div>
        )
    }

    const renderUsers = (game: GameSession) => {
        return (
            <div className={'flex flex-row'}>
                {game.users.map((user, index) => {
                    return (
                        <div className={'w-5 h-8 pointer-events-auto'} key={index}>
                            <Popover id={`quiz-result-profile-${user.user_uuid}`} info={user.nickname} key={index}>
                                <Profile user={user} key={index} className={'h-8 w-8'}/>
                            </Popover>
                        </div>
                    )
                })}
            </div>
        )
    }



    return (
        <Table
            queryKey={'gameSession'}
            fetchData={fetchGameSessions}
            columns={[
                { header: 'Spieler', cell: ({ row }) => renderUsers((row.original as GameSession)) },
                { header: 'Kurs', cell: ({ row }) => {
                        const course = allCourses.find(course => course.uuid === (row.original as GameSession).course);
                        return course ? course.name : 'Unbekannt' + ' (' + (row.original as GameSession).course + ')';
                    }},
                { header: 'Beendet am', cell: ({ row }) => renderEndedAt((row.original as GameSession)) },
                { header: 'Aktion', cell: ({ row }) => renderActions((row.original as GameSession)) },
            ]}
        />
    );
}

export default GameTable;