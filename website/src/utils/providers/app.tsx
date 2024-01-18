import * as React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { Room } from '../response';
import { axiosInstance } from '../axios_context';
import { UserContext, UserContextType } from './user';

export type AppContextType = {
    rooms?: Room[];
    loading: boolean;
    isError: boolean;
    message: any;
    next: CallableFunction;
    refresh: CallableFunction;
};

export const AppContext = React.createContext<AppContextType | null>(null);

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { user } = React.useContext(UserContext) as UserContextType;
    const [state, setState] = useState<{ loading: boolean, isError: boolean, message: any }>({loading: false, isError: false, message: ""});
    const [rooms, setRooms] = useState<Room[]>();

    const initMutation = useMutation({
        mutationKey: ["rooms"],
        mutationFn: () => axiosInstance.get("/rooms"),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Getting Rooms, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setRooms(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const nextMutation = useMutation({
        mutationKey: ["rooms"],
        mutationFn: (page:  number) => axiosInstance.get(`/rooms?page=${page}`),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Loading, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setRooms(init => [ ...init!, data.data]);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const refresh = async () => {};
    const next = (page: number) => nextMutation.mutate(page);

    const init = React.useCallback(async ()=> initMutation.mutate(), [user]);

    React.useEffect(()=> { init() }, [init, user]);

    return (
        <AppContext.Provider value={{ ...state, rooms, refresh, next }}>{ children }</AppContext.Provider>
    );
}

export default AppProvider;