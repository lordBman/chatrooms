import { useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Header, RoomsPreview } from "../components";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axios_context";
import { Room } from "../utils/response";

const Home = () =>{
    const userContext = useContext(UserContext) as UserContextType;

    const init = useQuery({
        queryKey: ["rooms"],
        queryFn: () => axiosInstance.get("/rooms"),
    });

    if(init.isLoading ){
        return <div>Loading...</div>
    }

    return (
        <div>
            <Header />
            <div>Rooms</div>
            <div>{ init.data?.data.map((room: Room) =>(<RoomsPreview room={room} />))}</div>
        </div>
    );
}

export default Home;