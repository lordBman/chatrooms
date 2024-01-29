import { useMutation } from "react-query";
import { axiosInstance } from "../../../utils/axios_context";
import { UserContext, UserContextType } from "../../../utils/providers/user";
import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Loading } from "../../../components";
import Util from "../../../utils/util";

const Edit = () =>{
    const navigate = useHistory();
    const userContext = useContext(UserContext) as UserContextType;

    const [state, setState] = useState<{ isError: boolean, message: any }>({ isError: false, message: `Saving Profile, please wait...` });
    
    const editMutation = useMutation({
        mutationKey: ["profile"],
        mutationFn: (data: any) => axiosInstance.post(`/users/profile`, data),
        onMutate:()=>setState(init => { return { ...init, isError: false, message: `Creating Room, please wait...`}}),
        onSuccess() {
            userContext.refresh();
            navigate.replace("/dashboard/profile/");
        },
        onError(error) {
            setState(init => { return { ...init, isError: true, message: JSON.stringify(error) }});
        },
    });

    const editForm = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();

        const data = Util.extract(event.currentTarget);

        editMutation.mutate(data);
    }

    if(editMutation.isLoading){
        return (
            <Loading />
        );
    }

    if(state.isError){
        return (
            <div>{ JSON.stringify(state.message) }</div>
        );
    }
    
    return (
        <div>
            <Link to={"/dashboard/profile"}>Go Back</Link>
            <form onSubmit={editForm} method="POST" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <label htmlFor="name">First Name</label>
                <input id="name" type="text" name="name" placeholder="Enter first name" />

                <label htmlFor="surname">Last Name</label>
                <input id="surname" type="text" name="surname" placeholder="Enter last name" />

                <label htmlFor="profile">Profile Picture</label>
                <input id="profile" type="file" name="profile" placeholder="Choose Profile Picture" />

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" placeholder="Tell us about yourself" />

                <input type="submit" value={"submit"} />
            </form>
        </div>
    );
}

export default Edit;