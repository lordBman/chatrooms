import React, { useContext} from "react";
import { Room } from "../utils/response";
import { LikesView, TagView } from ".";
import { useHistory } from "react-router-dom";
import { UserContext, UserContextType } from "../utils/providers/user";

export interface RoomsViewProps{
    room: Room;
}

const RoomsView: React.FC<RoomsViewProps> = ({ room }) =>{
    const history = useHistory();
    const userContext = useContext(UserContext) as UserContextType;
    const mine = userContext.user &&  userContext.user?.username === room.creator.username;

    const clicked = () =>{
        history.replace(`/dashboard/rooms/${room.id}`);
    }
    return (
        <div onClick={clicked} style={{ cursor: "pointer" }}>
            { JSON.stringify(room.title) }
        </div>
    );
}

export default RoomsView;