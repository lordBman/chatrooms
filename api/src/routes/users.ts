import express from "express";
import Session from "../config/session";
import User from "../models/users";
import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";

export const userRouter = express.Router();

userRouter.post("/", async(req, res) =>{
    if(req.body.username && req.body.email && req.body.password){
        let userID = await User.create(req.body.username, req.body.email, req.body.password);
        if(userID){
            const id = await new Session().create(userID);
            if(id){
                res.cookie("chatroom", id, {
                    expires: new Date(
                        Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN || `7`) * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
                });
                return res.status(HttpStatusCodes.CREATED).send({id: id, username: req.body.username, email: req.body.email });
            }else{
                return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "session creation failed, but registrated succesfully, try login in" });
            }
        }
        return DBManager.instance().errorHandler.display(res);
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "invalid req to server"});
    }
});

userRouter.get("/", async(req, res) =>{
    if(req.cookies.chatroom){
        const session = new Session();
        const userID = await session.get(req.cookies.chatroom);
        if(userID){
            const details = await User.details(userID);
            if(details){
                return res.status(HttpStatusCodes.OK).send(details);
            }else if(!DBManager.instance().errorHandler.has_error()){
                return res.status(HttpStatusCodes.NOT_FOUND).send({ message: "account not found" });   
            }
        }
        return DBManager.instance().errorHandler.display(res);
    }else{
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({message: "cookie expired, try login in again"});
    }
});

userRouter.post("/login", async(req, res) =>{
    if((req.body.email || req.body.username) && req.body.password){
        const result = await User.login({ email: req.body.email, username: req.body.username, password: req.body.password });
        console.log(result);
        if(result){
            res.cookie("chatroom", result.sessionID, {
                expires: new Date(
                    Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            });
            return res.status(HttpStatusCodes.OK).send({ id: result.sessionID, ...result.user });
        }
        return DBManager.instance().errorHandler.display(res);
    }else{
        return res.status(HttpStatusCodes.BAD_REQUEST).send({message: "invalid req to server"});
    }
});

userRouter.get("/logout", (req, res) =>{
    if(req.cookies.blimited){
        res.cookie("chatroom", '', {
            expires: new Date(Date.now() + 10 * 300),
            httpOnly: true,
          });
          res.status(HttpStatusCodes.OK).json({ status: 'success' });
    }else{
        return res.status(HttpStatusCodes.BAD_REQUEST).send({message: "invalid req to server"});
    }
});

export default userRouter;