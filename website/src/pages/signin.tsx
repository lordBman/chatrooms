import Util from "../utils/util";

const Signin = () =>{
    const register = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();

        const data = Util.extract(event.currentTarget);

        alert(JSON.stringify(data));
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
    );
}

export default Signin;