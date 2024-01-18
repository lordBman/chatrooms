import { HashRouter, Route, Routes } from "react-router-dom";
import { Home, NotFound, Signin } from "./pages";
import AppProvider from "./utils/providers/user";

const App = () =>{
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route index Component={Home}/>
          <Route path="/signin" Component={Signin} />
          <Route path="*" Component={NotFound}/>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
