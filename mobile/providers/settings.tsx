import React, { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { fileExists, retrieveData, saveData } from "../utils";

export interface  Theme {
    darkText: string,
    lightText: string,
    bodyText: string,
    pending: string,
    primaryColor: string
    backgroundColor: string,
    pendingSurface: string,
    successSurface: string,
    success: string,
    error: string,
    errorSurface: string,
}

export const CommonTheme ={
    darkText: "#353E51",
    pending: "#FFB321",
    pendingSurface: "#FFF3DB",
    successSurface: "#EDF9F0",
    success: "#287D3C",
    errorSurface: "#FEEFEF",
    error: "#DA1414",
    lightText: "#C8CBD0",
    bodyText: "#717783",
}


export const LightTheme: Theme = { ...CommonTheme, primaryColor: "#0094FF", backgroundColor: "white" }
export const DarkTheme: Theme = { ...CommonTheme, primaryColor: "#0094FF", backgroundColor: "#220012" }

export interface Settings{
    notifications: boolean,
}

export interface SettingsState{ error?: any, loading: boolean}

export type SettingsContextType = {
    theme: Theme,
    themeMode: "light" | "dark" | "auto",
    settings?: Settings,
    state: SettingsState,
    save: CallableFunction,
    toggleTheme: CallableFunction;
}

export const SettingsContext = React.createContext<SettingsContextType | null>(null);

const SettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const colorScheme = useColorScheme();

    const [ themeMode, setThemeMode ] = useState<"light" | "dark" | "auto">("auto");
    const [ settings, setSettings ] = useState<Settings>();
    const [ state, setState ] = useState<SettingsState>({ loading: true });

    const themeFrom = () =>{
        switch(themeMode){
            case "light":
                return LightTheme;
            case "dark":
                return DarkTheme;
            default:
                return colorScheme === "light" ? LightTheme : DarkTheme;
        }
    }

    const save = () =>{
        setState({ loading: true });
        saveData("settings.config", JSON.stringify({ themeMode, settings })).catch((error)=>{
            setState({...state, error});
        }).finally(()=>{
            setState({...state, loading: false });
        });
    }

    const initCallback = useCallback(async ()=>{
        if(!settings){
            setState({ loading: true });
            try{
                if(await fileExists("settings.config")){
                    const data = await retrieveData("settings.config");
                    const obj = JSON.parse(data);
        
                    setThemeMode(obj.themeMode);
                    setSettings(obj.settings);
                    setState({ loading: false });
                }else{
                    setSettings({ notifications: true });
                    themeFrom();
                    save();
                }
            }catch(error){
                console.log(error);
                setState({...state, error });
            }finally{
                setState({...state, loading: false });
            }
        }
    }, [settings]);

    useEffect(()=> { initCallback() }, [initCallback]);

    const toggleTheme  = () =>{
        setThemeMode((init)=> {
            if(init === "auto"){
                return "light";
            }else{
                return init === "light" ? "dark" : "auto" 
            }
        });
    }

    return (<SettingsContext.Provider value={{ theme: themeFrom(), themeMode, toggleTheme, settings, state, save }}>{children}</SettingsContext.Provider>);
}

export default SettingsProvider;

