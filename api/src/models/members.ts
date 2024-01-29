import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";

export default class Member {    
    static async check_members(userID: number, roomID: number): Promise<any>{
        try{
            const result = await DBManager.instance().db.members.findFirst({ where: { userID, roomID } })
            if(result){
                return true;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "profile checking error");
        }
        return undefined;
    }

    static async add( sessionID: string, roomID: number ): Promise<any>{
        try{
            const userID = await new Session().get(sessionID);
            if(await Member.check_members(userID!, roomID) === false){
                return await DBManager.instance().db.members.create({
                    data: { userID: userID!, roomID },
                    include: { user: true, room: true }
                });
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when creating or updating user");
        }
        return undefined;
    }

    static async remove( sessionID: string, roomID: number ): Promise<any>{
        try{
            const userID = await new Session().get(sessionID);
            return await DBManager.instance().db.members.delete({
                where: { userID_roomID:{ userID: userID!, roomID } },
                include: { user: true, room: true }
            });
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when creating or updating user");
        }
        return undefined;
    }
}