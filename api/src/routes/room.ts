import express from "express";
import Session from "../config/session";
import User from "../models/users";
import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";

export const roomRouter = express.Router();

roomRouter.get("/", async(req, res) =>{
    const sessionID = req.cookies.chatroom;
});

roomRouter.post("/", async(req, res) =>{
    if(req.cookies.chatroom){
        
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});