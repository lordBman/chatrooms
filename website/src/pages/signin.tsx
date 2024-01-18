import { useContext, useEffect } from "react";
import Util from "../utils/util";
import { AppContext, AppContextType } from "../utils/providers/user";
import { useNavigate } from "react-router-dom";

const Signin = () =>{
    const { loading, user, signin, login } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();

    const register = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();

        const data = Util.extract(event.currentTarget);

        signin({ email: data.email, username: data["username"], password: data["password"] })

        //alert(JSON.stringify(data.email));
    }

    const loginForm = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();

        const data = Util.extract(event.currentTarget);

        login({ username: data["username"], password: data["password"] })

        //alert(JSON.stringify(data.email));
    }

    useEffect(()=> user && navigate("/"), [user]);

    return (
        <div>
            <div>
                <form onSubmit={register} method="POST">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" placeholder="Email" required/>

                    <label htmlFor="username">User Name</label>
                    <input id="username" type="text" name="username" placeholder="Choose Username" required/>

                    <label htmlFor="password">Enter Password</label>
                    <input id="password" type="password" name="password" placeholder="Choose Pasowrd" required/>

                    <label htmlFor="repassword">Reenter Password</label>
                    <input id="repassword" type="password" name="repassword" placeholder="Confirm Pasowrd" required/>

                    <input type="submit" value={"submit"} />
                </form>
            </div>
            <div>
            <form onSubmit={loginForm} method="POST">
                <label htmlFor="username">User Name</label>
                <input id="username" type="text" name="username" placeholder="Enter Username" required/>

                <label htmlFor="password">Enter Password</label>
                <input id="password" type="password" name="password" placeholder="Enter Pasowrd" required/>

                <input type="submit" value={"submit"} />
            </form>
            </div>
            { loading && <div>Loading... </div> }
        </div>
    );
}

export default Signin;