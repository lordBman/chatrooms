import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../utils/providers/user";
import { TagItem } from "../components";
import { AppContext, AppContextType } from "../utils/providers/app";

const Create = () =>{
    const userContext = useContext(UserContext) as UserContextType;
    const appContext = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();
    const [data, setData] = useState({ title: "", tags: [""]});


    const change = (values: string[]) => setData((init)=>{ return {...init, tags: values } });
    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => setData((init)=>{ return {...init, title: event.target.value } });

    const create = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();

        appContext.create(data);
    }

    if(appContext.loading || userContext.loading){
        return (
            <div>Loading....</div>
        );
    }
    
    return (
        <div>
            <form onSubmit={create} method="POST">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" name="title" placeholder="type title" value={data.title} onChange={onTitleChange} required/>

                <TagItem onChange={change} values={data.tags}/>

                <input type="submit" value={"submit"} />
            </form>
        </div>
    );
}

export default Create;