import { useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Header } from "../components";
import { useQuery } from "react-query";
import { axiosInstance } from "../utils/axios_context";

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
            <div>Rooms: {JSON.stringify(init.data?.data)}</div>
            
        </div>
    );
}

export default Home;