import { useContext } from "react";
import UserProvider, { AppContext, AppContextType } from "../utils/providers/app";
import { UserContext, UserContextType } from "../utils/providers/user";

const Home = () =>{
    const appContext = useContext(AppContext) as AppContextType;
    const userContext = useContext(UserContext) as UserContextType;

    if(appContext.loading || userContext.loading){
        return <div>Loading...</div>
    }
    return (
        <div>Home</div>
    );
}

export default () =>{
    return (
        <UserProvider>
            <Home />
        </UserProvider>
    );
};