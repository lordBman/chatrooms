import { ChangeEvent, useContext, useState } from "react";
import { DashBoardContext, DashBoardContextType } from "../utils/providers/dashboard";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { axiosInstance } from "../utils/axios_context";
import { Room } from "../utils/response";
import { CommentView, LikesView, Loading, TagView } from ".";
import { UserContext, UserContextType } from "../utils/providers/user";

const Chat = () =>{
    const context = useContext(DashBoardContext) as DashBoardContextType;
    const userContext = useContext(UserContext) as UserContextType;

    const [room, setRoom] = useState<Room>();
    const [replyOpen, setReplyOpen] = useState<number>();
    const params = useParams() as any;
    const [message, setMessage] = useState("");
    const mine = userContext.user && room &&  userContext.user?.username === room.creator.username;

    const init = useQuery({
        queryKey: [params.id],
        queryFn: () => axiosInstance.get(`/rooms?id=${params.id}`),
        onSuccess(data) {
            setRoom(data.data);
        },
    });

    const sendMutation = useMutation({
        mutationKey: [params.id],
        mutationFn: (message: string) => axiosInstance.post(`/comments`, { roomID: params.id, message }),
        onSuccess() {
            init.refetch();
        },
    });

    const send = () =>{
        sendMutation.mutate(message);
        setMessage("");
    }

    const onReplyClicked = (index: number) => setReplyOpen((init) =>{
        if(index === init){
            return undefined;
        }
        return index;
    });

    const onMessageChange = (event: ChangeEvent<HTMLInputElement>) =>{
        setMessage(event.target.value);
    }

    if(init.isLoading || sendMutation.isLoading){
        return <Loading />;
    }

    if(init.isError || sendMutation.isError){
        return 
    }

    const error = JSON.stringify(init.error);
    const sendError = JSON.stringify(sendMutation.error);

    return (
        <div>
            { JSON.stringify(room) }
            <LikesView likes={room?.likes!} mine={mine || false} query={{ roomID: room?.id }} endpoint="/rooms" />
            <div>
                { room?.tags.map((tag)=>(<TagView key={tag.slurg} tag={tag} />)) }
            </div>
            <div>
                { room?.comments.map((comment, index) => <CommentView key={index} comment={comment} roomID={room.id} openReply={replyOpen === index} reply={ () => onReplyClicked(index) } />) }
            </div>
            <div>
                <input type="text" name="message" id="message" value={message} placeholder="type your message" onChange={onMessageChange}/>
                <button type="button" onClick={send}>submit</button>
            </div>
            <div>{ init.isError && error }</div>
            <div>{ sendMutation.isError && sendError }</div>
        </div>
    );
}

export default Chat;