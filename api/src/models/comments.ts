import { Likes } from ".";
import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import User, { UserDetails } from "./users"

export interface CommentDetails{
    id: number,
    message: string,
    user: UserDetails,
    attachment: string | null,
    likes: Likes[]
}

export default class Comment {    
    static async details(id: number): Promise<CommentDetails | undefined>{
        try{
            const result = await DBManager.instance().client.comment.findFirst({ where: { id }, include:{ user: { include: { profile: true } }, likes: { include: { user: true } } } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting comment");
        }
        return undefined;
    }

    static async get(roomID: number, page: number = 1): Promise<CommentDetails[] | undefined>{
        const commentsPerPage = 10; // Number of users to display per page
        try{
            const result = await DBManager.instance().client.comment.findMany({
                skip: (page - 1) * commentsPerPage, // Skip the appropriate number of records
                take: commentsPerPage, // Take only the specified number of records
                where: { roomID }, 
                include: { user: { include: { profile: true } }, likes: { include: { user: true } } }, 
                orderBy: { posted: "desc" } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting comments");
        }
        return undefined;
    }

    static async create(sessionID: string, roomID: number, message: string ): Promise<CommentDetails | undefined> {
        try{
            let userID = await new Session().get(sessionID);
            
            const comment = await DBManager.instance().client.comment.create({
                data: { message: message, userID: userID!, roomID },
                include: { user: true, likes: { include: { user: true } } }
            });
            
            await DBManager.instance().client.room.update({
                where: { id: roomID, },
                data: { lastCommented: comment.posted },
            });
            
            return comment;
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered whileposting comments");
        }
    }
}