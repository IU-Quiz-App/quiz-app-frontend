import {useNavigate, useParams} from "react-router-dom";
import {FC, useEffect} from "react";
import {joinGameSession} from "@services/Api.ts";

const GameUserJoin: FC = () => {
    const { uuid: uuid } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (!uuid) {
            console.error("No UUID provided");
            navigate("/dashboard");
            return;
        }

        joinGameSession(uuid)
            .then(function (result) {

                if (result) {
                    console.log("Game session joined successfully");
                    navigate(`/game/${uuid}`);
                } else {
                    console.error("Failed to join game session");
                    navigate("/dashboard");
                }
            })
    }, [uuid]);

    return null;
}

export default GameUserJoin;