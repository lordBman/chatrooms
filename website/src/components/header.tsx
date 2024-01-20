import { useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";
import { Link } from "react-router-dom";

const Header = () =>{
    const { user, logout } = useContext(UserContext) as UserContextType;

    if(!user){
        return <Link to={"/signin"}>Sign In</Link>
    }
    
    return (
        <button onClick={()=> logout() }>Logout</button>
    );
}

export default Header;