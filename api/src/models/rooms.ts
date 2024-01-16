import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import Comment, { CommentDetails } from "./comments";
import User, { UserDetails } from "./users";

export interface RoomDetails{
    id: number,
    title: string,
    creator: UserDetails,
    isPrivate: boolean,
    comments: CommentDetails[],
    attachment: string | null,
    members?: UserDetails[]
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
            const result = await DBManager.instance().client.room.findFirst({ where: { id }, include:{ creator:  { include: { profile: true } } } });
            if(result){
                const comments = await Comment.get(id);
                return { ...result, comments: comments! };
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting rooms details");
        }
        return undefined;
    }

    static async create(username: string, email: string, password: string): Promise<number | undefined>{
        try{
            if(await Room.check_users(email, username)){
                DBManager.instance().errorHandler.add(HttpStatusCodes.ALREADY_REPORTED, "", "user with the same email or phone number already exists");
            }else{
                return (await DBManager.instance().client.user.create({ data:{ email, username, password } })).id;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when creating user");
        }
        return undefined;
    }
}