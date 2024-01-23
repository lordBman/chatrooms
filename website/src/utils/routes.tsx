import { Link, Redirect, useLocation } from "react-router-dom";
//import server_down from "./assets/images/undraw_server_down_s-4-lk.svg";
import { FaAssistiveListeningSystems, FaHome, FaServer } from "react-icons/fa";
import { UserContext, UserContextType } from "./providers/user";
import { useContext } from "react";
import { Loading } from "../components";
import Util from "./util";

export enum Role{
    Admin, User, None
}

const titleToRole = (title: string): Role =>{
    switch(title){
        case "admin":
            return Role.Admin;
        case "user":
            return Role.User;
    }
    return Role.None;
}

interface PrivateRouteProps{
    roles: Role[],
    Element: React.ComponentType<any>,
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({Element, ...others}) =>{
    const { loading, user } = useContext(UserContext) as UserContextType;
    let isAuthenticated = false;
    const location = useLocation();
    const prevRoute = location.pathname.length >  1 ? Util.replaceAll(location.pathname, "/", "_").substring(1) : "";
``

    if(loading){
        return (<Loading />);
    }else if(!user && !loading){
        return (<Redirect to={`/signin/${prevRoute}`} />);
    }

    if(user){
        isAuthenticated = true;
    }
    
    return isAuthenticated ? <Element {...others} /> : (
        <div style={{display: "flex", width: "100dvw", height:"100dvh", justifyContent: "center", alignItems: "center", flexDirection:"column"}}>
            <img style={{minWidth:  "200px", maxWidth:"500px"}}/>
            <div className="mt-3 mx-3 text-center" style={{color: "gray", fontSize:"24px", maxWidth: "800px"}}><FaServer size={30} /> Sorry you are not authorized to view this page. you must be an admin, client or worker to view this page <FaAssistiveListeningSystems size={30} /></div>
            <Link to={"/"} className="btn btn-outline-primary mt-3" style={{borderRadius: "20px"}}><FaHome size={20} /> to Homepage</Link> 
        </div>
    );
}