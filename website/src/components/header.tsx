import { useContext } from "react";
import { AppContext, AppContextType } from "../utils/providers/user";
import { Link } from "react-router-dom";

const Header = () =>{
    const { user, logout } = useContext(AppContext) as AppContextType;

    if(!user){
        return <Link to={"/signin"}>Sign In</Link>
    }
    
    return (
        <button onClick={()=> logout() }>Logout</button>
    );
}

export default Header;