import React from "react";
import { Room } from "../utils/response";
import { TagView } from ".";
import { useHistory } from "react-router-dom";

export interface RoomsViewProps{
    room: Room;
}

const RoomsView: React.FC<RoomsViewProps> = ({ room }) =>{
    const history = useHistory();

    const clicked = () =>{
        history.replace(`/dashboard/${room.id}`);
    }
    return (
        <div onClick={clicked} style={{ cursor: "pointer" }}>
            { JSON.stringify(room.title) }
            <div>
                { room.tags.map((tag)=>(<TagView key={tag.slurg} tag={tag} />)) }
            </div>
        </div>
    );
}

export default RoomsView;