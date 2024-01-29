import { Link, Redirect, Route, Switch } from "react-router-dom";
import { DashBoardProvider } from "../../utils/providers";
import { DashBoardContext, DashBoardContextType } from "../../utils/providers/dashboard";
import { useContext } from "react";
import { UserContext, UserContextType } from "../../utils/providers/user";
import Rooms from "./main";
import Notifications from "./notifications";
import Settings from "./settings";
import Info from "./info";
import Profile from "./profile";

const DashBoard = () =>{
    const context = useContext(DashBoardContext) as DashBoardContextType;
    const userContext = useContext(UserContext) as UserContextType;

    const logout = () =>  userContext.logout();

    if(context.loading || userContext.loading){
        return <div>Loading...</div>
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to={"/dashboard"}>Rooms</Link>
                <Link to={"/dashboard/notifications"}>Notifications</Link>
                <Link to={"/dashboard/profile"}>Profile</Link>
                <Link to={"/dashboard/settings"}>Settings</Link>
            </div>
            <div style={{ flex: 1 }}>
                { userContext.user && ( <div>User: {JSON.stringify(userContext.user)}</div>) }
                <div>
                    <Link to={"/dashboard/rooms/create"}>Create Room</Link>
                    <button onClick={ logout }>Sign out</button>
                </div>
                <Switch>
                    <Route exact path="/dashboard">
                        <Redirect to={ "/dashboard/rooms" } />
                    </Route>
                    <Route path="/dashboard/rooms">
                        <Rooms />
                    </Route>
                    <Route path="/dashboard/notifications">
                        <Notifications />
                    </Route>
                    <Route path="/dashboard/profile">
                        <Profile />
                    </Route>
                    <Route path="/dashboard/settings">
                        <Settings />
                    </Route>
                    <Route path="/dashboard/info">
                        <Info />
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default () =>{
    return (
        <DashBoardProvider>
            <DashBoard />
        </DashBoardProvider>
    );
};