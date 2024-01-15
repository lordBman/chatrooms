import { useContext } from "react";
import { AppContext, AppContextType } from "../utils/providers";

const Home = () =>{
    const { loading, user, signin, login, logout } = useContext(AppContext) as AppContextType;

    if(loading){
        return <div>Loading...</div>
    }

    if(!user){
        return <button onClick={()=> login({ email: "okelekelenobel@gmail.com", password: "ffgffggbgbgbng" }) }>Login</button>
    }
    
    return (
        <button onClick={()=> logout() }>Logout</button>
    );
}

export default Home;