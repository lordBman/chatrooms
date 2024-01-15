import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";

export interface ProfileDetails{
    description?: string,
    path?: string 
}

export default class Profile {    
    static async check_profiles(userID: number): Promise<boolean | undefined>{
        try{
            const result = await DBManager.instance().client.profile.findFirst({ where: { userID } })
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
            const result = await DBManager.instance().client.profile.findFirst({ where: { userID } })
            if(result){
                return { description: result.description || undefined, path: result.path || undefined };
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "profile checking error");
        }
        return undefined;
    }

    static async createOrUpdate(details: { userID: number, path?: string, description?:string } ): Promise<number | undefined>{
        try{
            await DBManager.instance().client.profile.upsert({
                where: { userID: details.userID },
                update: { path: details.path, description: details.description },
                create: { userID: details.userID, path: details.path, description: details.description },
            });
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when creating or updating user");
        }
        return undefined;
    }
}