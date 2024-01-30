import React, { CSSProperties, ChangeEvent, useContext, useState } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Comment } from "../utils/response";
import { LikesView, SubCommentView } from ".";
import { useMutation } from "react-query";
import { axiosInstance } from "../utils/axios_context";

export interface CommentViewProps{
    comment: Comment,
    roomID: number,
    openReply: boolean,
    reply: CallableFunction
}

const CommentView: React.FC<CommentViewProps> = ({ comment, roomID, openReply, reply }) =>{
    const { user } = useContext(UserContext) as UserContextType;
    const [message, setMessage] = useState("");
    const date = new Date(comment.posted);

    const mine = user?.username === comment.user.username;

    const styles: CSSProperties = {
        justifySelf: ( mine ?  "self-end" : "self-start"),
        margin: 8
    };

    const sendReplyMutation = useMutation({
        mutationKey: [roomID],
        mutationFn: (message: string) => axiosInstance.post(`/comments/reply`, { roomID, commentID: comment.id , message }),
        onSuccess() {
            //init.refetch();
        },
    });

    const send = () =>{
        sendReplyMutation.mutate(message);
        setMessage("");
    }

    const onMessageChange = (event: ChangeEvent<HTMLInputElement>) =>{
        setMessage(event.target.value);
    }

    const clicked = () => reply();
;
    return (
        <div style={{ ...styles}} onClick={clicked}>
            {mine ? "me" : comment.user.username}: { comment.message }
            <LikesView likes={comment.likes} mine={mine} query={{ roomID, commentID: comment.id }} endpoint="/comments" />
            <div>{ date.toLocaleTimeString() }-{ date.toLocaleDateString() }</div>
            { openReply && (
                <div>
                    { comment.reply.map((sub) => <SubCommentView comment={sub} roomID={roomID} />) }
                    <div>
                        <input type="text" name="message" id="message" value={message} placeholder="type your message" onChange={onMessageChange}/>
                        <button type="button" onClick={send}>submit</button>
                    </div>
                </div>
            ) }
        </div>
    );
}

export default CommentView;