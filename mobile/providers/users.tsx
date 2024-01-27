import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { User } from '../utils/response';
import { axiosInstance } from '../utils/axios_context';

export type UserContextType = {
    user?: User;
    loading: boolean;
    isError: boolean;
    message: any;
    login: (cred: { email?:string, username?: string, password: string }) => void;
    logout: () => void;
    signin: (cred: { email:string, username: string, password: string }) => void;
    refresh: () => void;
};

export const UserContext = React.createContext<UserContextType | null>(null);

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<{ message: any, isError: boolean }>({message: `Loading, please wait...`, isError: false});
    const [user, setUser] = useState<User>();

    const logoutMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: () => axiosInstance.get("/users/logout"),
        onMutate:()=>setState(init => { return { ...init, isError: false, message: `Login in out, please wait...`}}),
        onSuccess() {
            setState(init => { return {...init, isError: false, message: `done`}}),
            setUser(undefined)
        },
        onError(error) {
            setState(init => { return { ...init, isError: true, message: JSON.stringify(error) }});
        },
    });
    
    const loginMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: (data: { email?:string, username?: string, password: string }) => axiosInstance.post("/users/login", data),
        onMutate:()=>setState(init => { return { ...init, isError: false, message: `Signing in, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, isError: false, message: `done`}}),
            setUser(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const signupMutation = useMutation({
        mutationKey: ["user"],
        mutationFn: (data: { email:string, username: string, password: string }) => axiosInstance.post("/users", data),
        onMutate:()=>setState(init => { return { ...init, isError: false, message: `Creating Acount, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setUser(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, isError: true, message: JSON.stringify(error) }});
        },
    });

    const initQuery = useQuery({
        queryKey: ["user"],
        queryFn: () => axiosInstance.get("/users"),
        onSuccess(data) {
            setState(init => { return {...init, isError: false, message: `done`}}),
            setUser(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, isError: true, message: JSON.stringify(error) }});
        },
    });

    const refresh = async () => initQuery.refetch();
    const login = (cred: { email?:string, username?: string, password: string }) => loginMutation.mutate(cred);
    const logout = () => logoutMutation.mutate();
    const signin = (cred: { email:string, username: string, password: string }) => signupMutation.mutate(cred);

    const loading = initQuery.isLoading || loginMutation.isLoading || signupMutation.isLoading || logoutMutation.isLoading;

    return (
        <UserContext.Provider value={{ ...state, user, refresh, signin, login, logout, loading }}>{ children }</UserContext.Provider>
    );
}

export default UserProvider;