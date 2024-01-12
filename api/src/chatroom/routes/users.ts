import express from "express";
import { User } from "../models";
import Session from "../../config/session";
import { DBManager } from "../../config/database";

export const userRouter = express.Router();

userRouter.post("/", async(req, res) =>{
    if(req.body.fname && req.body.username && req.body.email && req.body.phone && req.body.password){

        let userID = await User.create(req.body.fname, req.body.username, req.body.email, req.body.phone, req.body.password, req.body.platform || "blimited");
        if(userID){
            const session = new Session();
            const id = await session.create(userID.toString(), req.body.platform || "blimited");
            if(id){
                res.cookie(req.body.platform || "blimited", id, {
                    expires: new Date(
                        Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN || `7`) * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
                });
                const [name, surname] = req.body.fname.split(" ");
                return res.status(201).send({id: id, name: name, suname: surname, username: req.body.username, email: req.body.email, phone: req.body.phone});
            }else{
                return res.status(500).send({ message: "session creation failed, but registrated succesfully, try login in" });
            }
        }
        return DBManager.instance().errorHandler.display(res);
    }else{
        return res.status(500).send({message: "invalid req to server"});
    }
});

userRouter.get("/", async(req, res) =>{
    if(req.cookies.blimited){
        const session = new Session();
        const userID = await session.get(req.cookies.blimited);
        if(userID){
            const details = await User.details(userID);
            if(details){
                return res.status(200).send(details);
            }else if(!DBManager.instance().errorHandler.has_error()){
                return res.status(404).send({ message: "account not found" });   
            }
        }
        return DBManager.instance().errorHandler.display(res);
    }else{
        return res.status(500).send({message: "cookie expired, try login in again"});
    }
});

userRouter.post("/login", async(req, res) =>{
    if((req.body.email || req.body.phone || req.body.username) && req.body.password){
        const result = await User.login({ email: req.body.email, phone: req.body.phone, username: req.body.username, password: req.body.password, platform: req.body.platform });
        console.log(result);
        if(typeof result === "string" ){
            return res.status(400).send({ message: result });
        }else if(result){
            res.cookie(req.body.platform || "blimited", result.sessionID, {
                expires: new Date(
                    Date.now() + Number.parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            });
            return res.status(200).send({ id: result.sessionID, ...result.user });
        }
        return DBManager.instance().errorHandler.display(res);
    }else{
        return res.status(400).send({message: "invalid req to server"});
    }
});

userRouter.get("/logout", (req, res) =>{
    if(req.cookies.blimited){
        res.cookie('blimited', '', {
            expires: new Date(Date.now() + 10 * 300),
            httpOnly: true,
          });
          res.status(200).json({ status: 'success' });
    }else{
        return res.status(400).send({message: "invalid req to server"});
    }
});

export default userRouter;