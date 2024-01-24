import { Likes } from ".";
import { DBManager } from "../config";
import Session from "../config/session";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import Comment, { CommentDetails } from "./comments";
import Tag, { TagDetails } from "./tags";
import { UserDetails } from "./users";

export interface RoomDetails{
    id: number,
    title: string,
    creator: UserDetails,
    isPrivate: boolean,
    comments: CommentDetails[],
    attachment: string | null,
    members?: { user: UserDetails }[],
    tags: TagDetails[],
    likes: Likes[]
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
            const result = await DBManager.instance().client.room.findFirst({ where: { id }, include:{ creator:  { include: { profile: true } }, tags: true, likes: { include: { user: true } } } });
            if(result){
                const comments = await Comment.get(id);
                return { ...result, comments: comments! };
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting rooms details");
        }
        return undefined;
    }

    static async create(sessionID: string, title: string, isPrivate: boolean, tags: string[]): Promise<RoomDetails | undefined>{
        try{
            const creatorID = await new Session().get(sessionID);
            if(await Room.check_rooms(title)){
                DBManager.instance().errorHandler.add(HttpStatusCodes.ALREADY_REPORTED, "", "Room with the same title already exists");
            }else{
                const result = await DBManager.instance().client.room.create({ 
                    data:{ creatorID: creatorID!, title, isPrivate },
                    include: { 
                        creator: { include:{ profile: true } }, 
                        comments: { include: { user: true, likes: { include: { user: true } } } }, 
                        likes: { include: { user: true } }, } });
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
            let userID:  number | undefined;
            if(query.sessionID){
                userID = await new Session().get(query.sessionID);
            }
            const result = await DBManager.instance().client.room.findMany({
                take: roomsPerPage,
                skip: (page - 1) * roomsPerPage,
                where: {
                    OR:[ 
                        { members: { some: { userID},},},
                        { creatorID: userID },
                        { AND: [
                            // Rooms with tags similar to rooms liked by the user
                            { tags: { some: { room: { likes: { some: { userID, like: true,} }}}},},
                            { isPrivate: false },
                        ]}
                    ],
                },
                // You can adjust this based on your requirements
                orderBy: { lastCommented: 'desc' },
                // Include additional data if needed
                include: {
                    creator: true,
                    comments:{ include:{ user: true, likes: { include: { user: true } } } },
                    tags: true, members: { include: { user: true } },
                    likes: { include: { user: true } } },
            });
            return result;
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting rooms");
        }
    }

    static async dashboard(query: {sessionID: string, page?: number}): Promise<RoomDetails[] | undefined>{
        const roomsPerPage = 14; // Number of users to display per page
        const page = query.page || 1;
        try{
            let userID = await new Session().get(query.sessionID);

            const result = await DBManager.instance().client.room.findMany({
                take: roomsPerPage,
                skip: (page - 1) * roomsPerPage,
                where: {
                    OR: [
                        { creatorID: userID }, // Rooms created by the user
                        { members: { some: { userID } },}, // Rooms where the user is a member
                        { comments: { some: { userID },},}, // Rooms where the user has commented
                    ],
                },
                // You can adjust this based on your requirements
                orderBy: { lastCommented: 'desc' },
                // Include additional data if needed
                include: {
                    creator: true,
                    comments:{ include:{ user: true, likes: { include: { user: true } } } },
                    likes: { include: { user: true } },
                    tags: true, members: { include: { user: true, } }, },
            });
            return result;
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting rooms");
        }
    }

    static async toggleLike (sessionID: string, roomID: number): Promise<Likes|undefined>{
        try{
            let userID = await new Session().get(sessionID);
            const init = await DBManager.instance().client.roomLikes.findFirst({ where: { roomID } });
            if(init && init.like){
                return await DBManager.instance().client.roomLikes.delete({ where: { userID_roomID: { userID: userID!, roomID } }, include: { user: true }});
            }else{
                return await DBManager.instance().client.roomLikes.upsert({
                    where: { userID_roomID: { userID: userID!, roomID } },
                    update: { like: true },
                    create: { userID: userID!, roomID, like: true },
                    include: { user: true }
                });
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while liking the room");
        }
    }

    static async toggleDislike (sessionID: string, roomID: number): Promise<Likes|undefined>{
        try{
            let userID = await new Session().get(sessionID);
            const init = await DBManager.instance().client.roomLikes.findFirst({ where: { roomID } });
            if(init && !init.like){
                return await DBManager.instance().client.roomLikes.delete({ where: { userID_roomID: { userID: userID!, roomID } }, include: { user: true }});
            }else{
                return await DBManager.instance().client.roomLikes.upsert({
                    where: { userID_roomID: { userID: userID!, roomID } },
                    update: { like: false },
                    create: { userID: userID!, roomID, like: false },
                    include: { user: true }
                });
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while disliking the room");
        }
    }
}