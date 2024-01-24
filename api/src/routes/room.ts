import express from "express";
import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import Room from "../models/rooms";

const roomRouter = express.Router();

roomRouter.get("/", async(req, res) =>{
    const sessionID = req.cookies.chatroom;
    const page:  number = Number.parseInt((req.query.page as string) || "1");
    const id: number | undefined = req.query.id ?  Number.parseInt(req.query.id as string) : undefined;

    console.log(`room id:${id}`);

    const rooms = id ? await Room.details(id) : await Room.get({ sessionID, page });
    if(DBManager.instance().errorHandler.has_error()){
        return DBManager.instance().errorHandler.display(res);
    }
    return res.status(HttpStatusCodes.OK).send(rooms);
});

roomRouter.post("/", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.title){
            const isPrivate = req.body.isPrivate === "true";
            let room = await Room.create(req.cookies.chatroom, req.body.title, isPrivate, req.body.tags || []);
            if(room){
                return res.status(HttpStatusCodes.CREATED).send(room);
            }
            return DBManager.instance().errorHandler.display(res);
        }else{
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "invalid req to server"});
        }
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});

roomRouter.post("/like", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.roomID){
            let like = await Room.toggleLike(req.cookies.chatroom, Number.parseInt(req.body.roomID));
            if(like){
                return res.status(HttpStatusCodes.OK).send(like);
            }
            return DBManager.instance().errorHandler.display(res);
        }else{
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "invalid request to server"});
        }
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});

roomRouter.post("/dislike", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.roomID){
            let like = await Room.toggleDislike(req.cookies.chatroom, Number.parseInt(req.body.roomID));
            if(like){
                return res.status(HttpStatusCodes.OK).send(like);
            }
            return DBManager.instance().errorHandler.display(res);
        }else{
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "invalid request to server"});
        }
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});

export default roomRouter;