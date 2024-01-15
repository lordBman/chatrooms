import * as React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { User } from './response';
import { axiosInstance } from './authcontext';

export type AppContextType = {
    user?: User;
    loading: boolean;
    isError: boolean;
    message: any;
    login: (cred: { email?:string, username?: string, password: string }) => void;
    logout: () => void;
    signin: (cred: { email:string, username: string, password: string }) => void;
    refresh: () => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<{ loading: boolean, isError: boolean, message: any }>({loading: false, isError: false, message: ""});
    const [user, setUser] = useState<User>();

    const logoutMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: () => axiosInstance.get("/users/logout"),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Login in out, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setUser(undefined);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });
    
    const loginMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: (data: { email?:string, username?: string, password: string }) => axiosInstance.post("/users/login", data),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Signing in, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setUser(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const signupMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: (data: { email:string, username: string, password: string }) => axiosInstance.post("/users", data),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Creating Acount, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setUser(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const initMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: () => axiosInstance.get("/users"),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Loading, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setUser(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const refresh = async () => {};
    const login = (cred: { email?:string, username?: string, password: string }) => loginMutation.mutate(cred);
    const logout = () => logoutMutation.mutate();
    const signin = (cred: { email:string, username: string, password: string }) => signupMutation.mutate(cred);

    const init = React.useCallback(async ()=>{
        if(!user){
            initMutation.mutate();
        }
    }, [user]);

    React.useEffect(()=> { init() }, [init, user]);

    return (
        <AppContext.Provider value={{ ...state, user, refresh, signin, login, logout }}>{ children }</AppContext.Provider>
    );
}

export default AppProvider;