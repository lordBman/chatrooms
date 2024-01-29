import { Switch, Route, Link } from "react-router-dom";
import { Create, Chat, RoomsView } from "../../components";
import { useContext } from "react";
import { DashBoardContext, DashBoardContextType } from "../../utils/providers/dashboard";

const Rooms = () =>{
    const context = useContext(DashBoardContext) as DashBoardContextType;

    return (
        <div>
            <div style={{ display: "flex",  }}>
                <div style={{ width: 400, textWrap: "wrap" }}>
                    <div>Rooms:</div>
                    <div>{context.rooms?.map((room, index) => <RoomsView key={index} room={room} />)}</div>
                </div>
                <div>
                    <Switch>
                        <Route exact path={"/dashboard/rooms"}>
                            <Link to={"/dashboard/rooms/create"}>Create Room</Link>
                        </Route>
                        <Route exact path="/dashboard/rooms/create">
                            <Create />
                        </Route>
                        <Route path="/dashboard/rooms/:id">
                            <Chat />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default Rooms;