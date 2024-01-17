import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import Comment, { CommentDetails } from "./comments";
import Tag, { TagDetails } from "./tags";
import User, { UserDetails } from "./users";

export interface RoomDetails{
    id: number,
    title: string,
    creator: UserDetails,
    isPrivate: boolean,
    comments: CommentDetails[],
    attachment: string | null,
    members?: UserDetails[],
    tags: TagDetails[]
}

export default class Room {    
    static async check_rooms(title: string): Promise<boolean | undefined>{
        try{
            const result = await DBManager.instance().client.room.findFirst({ where: { title } })
            if(result){
                return true;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "rooms checking error");
        }
        return undefined;
    }

    static async details(id: number): Promise<RoomDetails | undefined>{
        try{
            const result = await DBManager.instance().client.room.findFirst({ where: { id }, include:{ creator:  { include: { profile: true } }, tags: true } });
            if(result){
                const comments = await Comment.get(id);
                return { ...result, comments: comments! };
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting rooms details");
        }
        return undefined;
    }

    static async create(creatorID: number, title: string, isPrivate: boolean, tags: string[]): Promise<RoomDetails | undefined>{
        try{
            if(await Room.check_rooms(title)){
                DBManager.instance().errorHandler.add(HttpStatusCodes.ALREADY_REPORTED, "", "Room with the same title already exists");
            }else{
                const result = await DBManager.instance().client.room.create({ 
                    data:{ creatorID, title, isPrivate },
                    include: { creator: { include:{ profile: true } }, comments: { include: { user: true } } } });
                if(result){
                    const initTags = await Tag.create(result.id, tags);
                    return { ...result, tags: initTags! }
                }
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when creating user");
        }
        return undefined;
    }

    static async get(query: {sessionID?: string, page?: number}): Promise<RoomDetails[] | undefined>{
        const roomsPerPage = 14; // Number of users to display per page
        const page = query.page || 1;
        try{
            if(query.sessionID){
                const userID = await new Session().get(query.sessionID);
                if(userID){

                }
            }
            const result = await DBManager.instance().client.room.findMany({
                skip: (page - 1) * roomsPerPage, // Skip the appropriate number of records
                take: roomsPerPage, // Take only the specified number of records 
                include: { creator: { include: { profile: true } }, tags: true, comments:{ include:{user: { include: { profile: true } } } } }, 
                orderBy: { posted: "desc" } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting comment");
        }
        return undefined;
    }
}