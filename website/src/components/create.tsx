import { ChangeEvent, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext, UserContextType } from "../utils/providers/user";
import { TagsCreate } from ".";
import { DashBoardContext, DashBoardContextType } from "../utils/providers/dashboard";
import { axiosInstance } from "../utils/axios_context";
import { useMutation } from "react-query";

const Create = () =>{
    const userContext = useContext(UserContext) as UserContextType;
    const context = useContext(DashBoardContext) as DashBoardContextType;
    const navigate = useHistory();
    const [data, setData] = useState({ title: "", tags: [""], isPrivate: false});
    const [state, setState] = useState<{ loading: boolean, isError: boolean, message: any }>({ loading: false, isError: false, message: `Creating Room, please wait...` });


    const change = (values: string[]) => setData((init)=>{ return {...init, tags: values } });
    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => setData((init)=>{ return {...init, title: event.target.value } });
    const onPrivateChange = (event: ChangeEvent<HTMLInputElement>) => setData((init)=>{ return {...init, isPrivate: event.target.checked } });

    const createMutation = useMutation({
        mutationKey: ["dashboard"],
        mutationFn: (data: { title: string, tags: string[] }) => axiosInstance.post(`/rooms`, data),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Creating Room, please wait...`}}),
        onSuccess() {
            //setState(init => { return {...init, loading: false, isError: false, message: `done`}});
            context.refresh();
            navigate.replace("/dashboard");
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const create = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();

        createMutation.mutate(data);
    }

    if(context.loading || userContext.loading || state.loading){
        return (
            <div>Loading....</div>
        );
    }
    
    return (
        <div>
            <form onSubmit={create} method="POST">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" name="title" placeholder="type title" value={data.title} onChange={onTitleChange} required/>
                
                <label htmlFor="isPrivate">Private</label>
                <input id="isPrivate" type="checkbox" name="isPrivate" checked={data.isPrivate} onChange={onPrivateChange} />

                <TagsCreate onChange={change} values={data.tags}/>

                <input type="submit" value={"submit"} />
            </form>
            <div>{ state.isError && state.message }</div>
        </div>
    );
}

export default Create;