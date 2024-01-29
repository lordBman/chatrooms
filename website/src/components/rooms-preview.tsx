import { useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Room } from "../utils/response";
import { Link } from "react-router-dom";
import { TagView } from ".";

export interface RoomsPreviewProps{
    room: Room
}

const RoomsPreview: React.FC<RoomsPreviewProps> = ({ room }) =>{
    const userContext = useContext(UserContext) as UserContextType;
    
    return (
        <div>
            { JSON.stringify(room) }
            <div>Title: { room.title }</div>
            <div>
                { room.tags.map((tag)=>(<TagView key={tag.slurg} tag={tag} />)) }
            </div>
            <div>
                { !userContext.user && <Link to={"/signin"}>Singin to Comment</Link> }
                { userContext.user && <Link to={`/dashboard/rooms/${room.id}`}>comment</Link> }
            </div>
        </div>
        
    );
}

export default RoomsPreview;