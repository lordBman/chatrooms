import { Switch, Route } from "react-router-dom";
import Edit from "./edit";
import Details from "./details";

const Profile = () =>{
    return (
        <div>
            <Switch>
                <Route exact path="/dashboard/profile">
                    <Details />
                </Route>
                <Route exact path="/dashboard/profile/edit">
                    <Edit />
                </Route>
            </Switch>
        </div>
    );
}

export default Profile;