import { useContext } from "react";
import UserProvider, { AppContext, AppContextType } from "../utils/providers/app";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Header } from "../components";
import { Link } from "react-router-dom";

const Home = () =>{
    const appContext = useContext(AppContext) as AppContextType;
    const userContext = useContext(UserContext) as UserContextType;

    if(appContext.loading || userContext.loading){
        return <div>Loading...</div>
    }
    return (
        <div>
            <Header />
            { userContext.user && (
                <div>
                    <div>User: {JSON.stringify(userContext.user)}</div>
                </div>
            ) }
            <Link to={"/create"}>Create Room</Link>
            <div>Rooms: {JSON.stringify(appContext.rooms)}</div>
        </div>
    );
}

export default Home;