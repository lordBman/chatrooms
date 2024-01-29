import { useContext } from "react";
import { UserContext, UserContextType } from "../../../utils/providers/user";
import { Link } from "react-router-dom";

const Details = () =>{
    const userContext = useContext(UserContext) as UserContextType;
    
    return (
        <div>
            { JSON.stringify(userContext.user) }
            <div>
                <Link to={"/dashboard/profile/edit"}>Edit Profile</Link>
            </div>
        </div>
    );
}

export default Details;