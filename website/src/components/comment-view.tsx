import React, { CSSProperties, useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Comment } from "../utils/response";
import { LikesView } from ".";

export interface CommentViewProps{
    comment: Comment,
    roomID: number
}

const CommentView: React.FC<CommentViewProps> = ({ comment, roomID }) =>{
    const { user } = useContext(UserContext) as UserContextType;
    const date = new Date(comment.posted);

    const mine = user?.username === comment.user.username;

    const styles: CSSProperties = {
        justifySelf: ( mine ?  "self-end" : "self-start"),
        margin: 8
    };
;
    return (
        <div style={{ ...styles}}>
            {mine ? "me" : comment.user.username}: { comment.message }
            <LikesView likes={comment.likes} mine={mine} query={{ roomID, commentID: comment.id }} endpoint="/comments" />
            <div>{ date.toLocaleTimeString() }-{ date.toLocaleDateString() }</div>
        </div>
    );
}

export default CommentView;