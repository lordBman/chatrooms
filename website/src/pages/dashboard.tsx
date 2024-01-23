import { Link, Route, Switch } from "react-router-dom";
import { DashBoardProvider } from "../utils/providers";
import { Chat, Create, RoomsView } from "../components";
import { DashBoardContext, DashBoardContextType } from "../utils/providers/dashboard";
import { useContext } from "react";
import { UserContext, UserContextType } from "../utils/providers/user";

const DashBoard = () =>{
    const context = useContext(DashBoardContext) as DashBoardContextType;
    const userContext = useContext(UserContext) as UserContextType;

    if(context.loading || userContext.loading){
        return <div>Loading...</div>
    }

    return (
        <div>
            <div>
                { userContext.user && ( <div>User: {JSON.stringify(userContext.user)}</div>) }
                <div>
                    <Link to={"/dashboard/create"}>Create Room</Link>
                </div>
                <div style={{ display: "flex",  }}>
                    <div style={{ width: 400, textWrap: "wrap" }}>
                        <div>Rooms:</div>
                        <div>{context.rooms?.map((room, index) => <RoomsView key={index} room={room} />)}</div>
                    </div>
                    <div>
                        <Switch>
                            <Route exact path={"/dashboard"}>
                                <Link to={"/dashboard/create"}>Create Room</Link>
                            </Route>
                            <Route exact path="/dashboard/create">
                                <Create />
                            </Route>
                            <Route path="/dashboard/:id">
                                <Chat />
                            </Route>
                        </Switch>
                    </div>
                </div>
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