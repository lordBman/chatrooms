import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import User, { UserDetails } from "./users"

export interface CommentDetails{
    id: number,
    message: string,
    user: UserDetails,
    attachment: string | null
}

export default class Comment {    
    static async details(id: number): Promise<CommentDetails | undefined>{
        try{
            const result = await DBManager.instance().client.comment.findFirst({ where: { id }, include:{ user: { include: { profile: true } } } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting comment");
        }
        return undefined;
    }

    static async get(roomID: number, page: number = 1): Promise<CommentDetails[] | undefined>{
        try{
            const result = await DBManager.instance().client.comment.findMany({ where: { roomID }, include: { user: { include: { profile: true } } }, orderBy: { posted: "desc" } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting comment");
        }
        return undefined;
    }
}