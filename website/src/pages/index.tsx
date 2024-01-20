import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../utils/providers";
import Create from "./create";
import Home from "./home";
import NotFound from "./not_fount";
import Signin from "./signin";

const Pages = () =>{
    return (
        <BrowserRouter>
            <AppProvider>
                <Routes>
                    <Route index Component={Home}/>
                    <Route path="/create" Component={Create} />
                    <Route path="*" Component={NotFound}/>
                </Routes>
            </AppProvider>
            <Routes>
                <Route path="/signin" Component={Signin} />
            </Routes>
        </BrowserRouter>
    );
}

export default Pages;

