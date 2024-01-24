import express from "express";
import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import Comment from "../models/comments";

export const commentsRouter = express.Router();

commentsRouter.get("/", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.query.roomID){
            const page:  number = Number.parseInt((req.query.page as string) || "1");
            const roomID:  number = Number.parseInt((req.query.roomID as string));

            const rooms = await Comment.get(roomID, page);
            if(DBManager.instance().errorHandler.has_error()){
                return DBManager.instance().errorHandler.display(res);
            }
            return res.status(HttpStatusCodes.OK).send(rooms);
        }else{
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "invalid request to server"});
        }
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});

commentsRouter.post("/", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.roomID && req.body.message){
            let comment = await Comment.create(req.cookies.chatroom, Number.parseInt(req.body.roomID), req.body.message);
            if(comment){
                return res.status(HttpStatusCodes.CREATED).send(comment);
            }
            return DBManager.instance().errorHandler.display(res);
        }else{
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "invalid request to server"});
        }
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});

commentsRouter.post("/like", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.commentID){
            let like = await Comment.toggleLike(req.cookies.chatroom, Number.parseInt(req.body.commentID));
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

commentsRouter.post("/dislike", async(req, res) =>{
    if(req.cookies.chatroom){
        if(req.body.commentID){
            let like = await Comment.toggleDislike(req.cookies.chatroom, Number.parseInt(req.body.commentID));
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

export default commentsRouter;