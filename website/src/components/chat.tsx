import { ChangeEvent, useContext, useState } from "react";
import { DashBoardContext, DashBoardContextType } from "../utils/providers/dashboard";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { axiosInstance } from "../utils/axios_context";
import { Room } from "../utils/response";
import { CommentView, Loading } from ".";

const Chat = () =>{
    const context = useContext(DashBoardContext) as DashBoardContextType;
    const [room, setRoom] = useState<Room>();
    const params = useParams() as any;
    const [message, setMessage] = useState("");

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
            <div>
                { room?.comments.map((comment, index) => <CommentView key={index} comment={comment} />) }
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