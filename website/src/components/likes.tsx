import { useMutation } from "react-query";
import { axiosInstance } from "../utils/axios_context";
import { Likes } from "../utils/response";
import { useContext, useState } from "react";
import Util from "../utils/util";
import { UserContext, UserContextType } from "../utils/providers/user";

export interface LikesProps{
    likes: Likes[],
    endpoint: string,
    mine: boolean,
    query: any
}

const LikesView: React.FC<LikesProps> = ({ likes, endpoint, mine, query, }) =>{
    const [current, setLikes] = useState(likes);
    const userContext = useContext(UserContext) as UserContextType;

    const likeMutation = useMutation({
        mutationKey: ["likes"],
        mutationFn: () => axiosInstance.post(`${endpoint}/like` , query),
        onSuccess(data) {
            setLikes(data.data);
        },
    });

    const dislikeMutation = useMutation({
        mutationKey: ["likes"],
        mutationFn: () => axiosInstance.post(`${endpoint}/dislike`, query),
        onSuccess(data) {
            setLikes(data.data);
        },
    });
    
    const like = () => !mine && likeMutation.mutate();
    const dislike = () => !mine && dislikeMutation.mutate();
    let likesCOunt = Util.likesCount(current, userContext.user);
    
    return (
        <div>
            <button style={{ backgroundColor: (likesCOunt.iLike === true ? "lightblue" : undefined) }} onClick={like}>likes: {likesCOunt.likes}</button>
            <button style={{ backgroundColor: (likesCOunt.iLike === false ? "lightblue" : undefined) }} onClick={dislike}>diskiles: { likesCOunt.dislikes }</button>
        </div>
    );
}

export default LikesView;