import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Room } from '../utils/response';
import { axiosInstance } from '../utils/axios_context';

export type DashBoardContextType = {
    rooms?: Room[];
    loading: boolean;
    isError: boolean;
    message: any;
    next: CallableFunction;
    refresh: CallableFunction;
};

export const DashBoardContext = React.createContext<DashBoardContextType | null>(null);

const DashBoardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<{ loading: boolean, isError: boolean, message: any }>({ loading: true, isError: false, message: `Getting Rooms, please wait...` });
    const [rooms, setRooms] = useState<Room[]>();

    const init = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => axiosInstance.get("/users/dashboard"),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setRooms(data.data);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const nextMutation = useMutation({
        mutationKey: ["dashboard"],
        mutationFn: (page:  number) => axiosInstance.get(`/users/dashboard?page=${page}`),
        onMutate:()=>setState(init => { return { ...init, loading: true, isError: false, message: `Loading, please wait...`}}),
        onSuccess(data) {
            setState(init => { return {...init, loading: false, isError: false, message: `done`}}),
            setRooms(init => [ ...init!, data.data]);
        },
        onError(error) {
            setState(init => { return { ...init, loading: false, isError: true, message: JSON.stringify(error) }});
        },
    });

    const refresh = async () => init.refetch();
    const next = (page: number) => nextMutation.mutate(page);

    return (
        <DashBoardContext.Provider value={{ ...state, rooms, refresh, next }}>{ children }</DashBoardContext.Provider>
    );
}

export default DashBoardProvider;