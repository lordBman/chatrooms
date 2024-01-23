import React, { useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Comment } from "../utils/response";

export interface CommentViewProps{
    comment: Comment
}

const CommentView: React.FC<CommentViewProps> = ({ comment }) =>{
    const { user } = useContext(UserContext) as UserContextType;
    const date = new Date(comment.posted);

    if(user?.username === comment.user.username){
        return (<div style={{ justifySelf: "end", margin: 8 }}>
            me: { comment.message }
            <div>{ date.toLocaleTimeString() }-{ date.toLocaleDateString() }</div>
        </div>);
    }
    return (
        <div style={{ justifySelf: "start", margin: 8}}>
            {comment.user.username}: { comment.message }
            <div>{ date.toLocaleTimeString() }-{ date.toLocaleDateString() }</div>
        </div>
    );
}

export default CommentView;