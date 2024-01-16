import { useContext } from "react";
import { AppContext, AppContextType } from "../utils/providers";

const Home = () =>{
    const { loading } = useContext(AppContext) as AppContextType;

    if(loading){
        return <div>Loading...</div>
    }
    return (
        <div>Home</div>
    );
}

export default Home;