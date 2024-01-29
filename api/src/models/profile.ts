import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";

export interface ProfileDetails{
    name?: string | null,
    surname?: string | null
    description?: string | null,
    path?: string | null
}

export default class Profile {    
    static async check_profiles(userID: number): Promise<boolean | undefined>{
        try{
            const result = await DBManager.instance().db.profile.findFirst({ where: { userID } })
            if(result){
                return true;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "profile checking error");
        }
        return undefined;
    }

    static async details(userID: number): Promise<ProfileDetails | undefined>{
        try{
            const result = await DBManager.instance().db.profile.findFirst({ where: { userID } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "profile checking error");
        }
        return undefined;
    }

    static async createOrUpdate( sessionID: string, details: { name?: string, surname?: string, path?: string, description?:string } ): Promise<ProfileDetails | undefined>{
        const name = (details.name === null || details.name?.length === 0) ? undefined : details.name;
        const surname = (details.surname === null || details.surname?.length === 0) ? undefined : details.surname;
        const description = (details.description === null || details.description?.length === 0) ? undefined : details.description;
        try{
            const userID = await new Session().get(sessionID);
            return await DBManager.instance().db.profile.upsert({
                where: { userID: userID },
                update: { path: details.path, description, name, surname },
                create: { userID: userID!, path: details.path, description,  name, surname },
                include: { user: true }
            });
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when creating or updating user");
        }
        return undefined;
    }
}