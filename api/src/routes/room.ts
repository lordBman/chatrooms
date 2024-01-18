import express from "express";
import Session from "../config/session";
import User from "../models/users";
import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import Room from "../models/rooms";

export const roomRouter = express.Router();

roomRouter.get("/", async(req, res) =>{
    const sessionID = req.cookies.chatroom;
    const page:  number = Number.parseInt((req.query.page as string) || "1");

    const rooms = await Room.get({ sessionID, page });
    if(DBManager.instance().errorHandler.has_error()){
        return DBManager.instance().errorHandler.display(res);
    }
    return res.status(HttpStatusCodes.OK).send(rooms);
});

roomRouter.post("/", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.title){
            let room = await Room.create(req.cookies.chatroom, req.body.title, req.body.isPrivate || false, req.body.tags || []);
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

export default roomRouter;