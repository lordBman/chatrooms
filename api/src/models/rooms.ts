import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { CommentDetails } from "./comments";
import User, { UserDetails } from "./users";

export interface RoomDetails{
    id: number,
    title: string,
    creator: UserDetails,
    isPrivate: boolean,
    comments: CommentDetails[],
    attachment: string | null,
    members: UserDetails[]
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
            const result = await DBManager.instance().client.room.findFirst({ where: { id }, include:{ creator:  { include: { profile: true } }, members: true, comments: { include: { user: { include:{ profile: true } } } } } })
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting rooms details");
        }
        return undefined;
    }

    static async login(credentials:{ email?:string, username?: string, password: string }): Promise<{user: UserDetails, sessionID: string} | undefined>{
        try{
            const result = await DBManager.instance().client.user.findFirst({ where:{ OR:[ { email: credentials.email }, { username: credentials.username } ] } });
            if(result){
                if(result.password === credentials.password){
                    const session = new Session();
                    const id = await session.create(result.id);
                    const profile = await Profile.details(result.id);
                    if(id){
                        return { sessionID: id, user: { ...result, profile} };
                    }
                }else{
                    DBManager.instance().errorHandler.add(HttpStatusCodes.UNAUTHORIZED, ``, "incorrect password, please try again");
                }
            }else if(!DBManager.instance().errorHandler.has_error()){
                DBManager.instance().errorHandler.add(HttpStatusCodes.NOT_FOUND, ``, "account with this email address or phone number not found");
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when trying to signin");
        }
    }

    static async get_id(credentials:{ email?:string, username?: string }): Promise<number | undefined>{
        try{
            const result = await DBManager.instance().client.user.findFirst({ where:{ OR:[ { email: credentials.email }, { username: credentials.username } ] } });
            if(result){
                return  result.id;
            }else{
                DBManager.instance().errorHandler.add(HttpStatusCodes.NOT_FOUND, "", "user does not exists");
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered when trying to get user");
        }
    }

    static async create(username: string, email: string, password: string): Promise<number | undefined>{
        try{
            if(await this.check_users(email, username)){
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