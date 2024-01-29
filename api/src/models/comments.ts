import { Likes, Member } from ".";
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
            const result = await DBManager.instance().db.comment.findFirst({ where: { id }, include:{ user: { include: { profile: true } }, likes: { include: { user: true } } } })
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
            const result = await DBManager.instance().db.comment.findMany({
                skip: (page - 1) * commentsPerPage, // Skip the appropriate number of records
                take: commentsPerPage, // Take only the specified number of records
                where: { roomID }, 
                include: { user: { include: { profile: true } }, likes: { include: { user: true } } }, 
                orderBy: { posted: "asc" } })
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
            
            const comment = await DBManager.instance().db.comment.create({
                data: { message: message, userID: userID!, roomID },
                include: { user: true, room: true, likes: { include: { user: true } } }
            });

            if(comment.room.creatorID !== userID){
                await Member.add(sessionID, roomID);
            }
            
            await DBManager.instance().db.room.update({
                where: { id: roomID, },
                data: { lastCommented: comment.posted },
            });
            
            return comment;
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered whileposting comments");
        }
    }

    static async toggleLike (sessionID: string, commentID: number): Promise<Likes[]| undefined>{
        try{
            let userID = await new Session().get(sessionID);
            const init = await DBManager.instance().db.commentLikes.findFirst({ where:{ userID: userID!, commentID } });
            if(init && init.like){
                await DBManager.instance().db.commentLikes.delete({ where: { userID_commentID: { userID: userID!, commentID } }});
            }else{
                await DBManager.instance().db.commentLikes.upsert({
                    where: { userID_commentID: { userID: userID!, commentID } },
                    update: { like: true },
                    create: { userID: userID!, commentID, like: true },
                });
            }
            return await DBManager.instance().db.commentLikes.findMany({ include: { user: true } });
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while liking the comment");
        }
    }

    static async toggleDislike (sessionID: string, commentID: number): Promise<Likes[]| undefined>{
        try{
            let userID = await new Session().get(sessionID);
            const init = await DBManager.instance().db.commentLikes.findFirst({  where:{ userID: userID!, commentID } });
            if(init && !init.like){
                await DBManager.instance().db.commentLikes.delete({ where: { userID_commentID: { userID: userID!, commentID } }});
            }else{
                await DBManager.instance().db.commentLikes.upsert({
                    where: { userID_commentID: { userID: userID!, commentID } },
                    update: { like: false },
                    create: { userID: userID!, commentID, like: false },
                });
            }
            return await DBManager.instance().db.commentLikes.findMany({ include: { user: true } });
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while disliking the comment");
        }
    }
}