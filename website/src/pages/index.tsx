import { BrowserRouter, Route, Switch, } from "react-router-dom";
import Home from "./home";
import NotFound from "./not_fount";
import Signin from "./signin";
import { PrivateRoute, Role } from "../utils/routes";
import DashBoard from "./dashboard";

const Pages = () =>{
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={"/"}>
                    <Home />
                </Route>
                <Route path="/signin">
                    <Signin />
                </Route>
                <Route path="/dashboard">
                    <PrivateRoute roles={[Role.User]} Element={DashBoard}/>
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default Pages;

