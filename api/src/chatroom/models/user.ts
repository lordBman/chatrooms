import Session from "../../config/session";
import { DBManager } from "../../config/database";

export interface UserDetails{
    name: string, surname: string, username: string, email: string, phone: string, type:string
}

export default class User {    
    static async check_users(email: string, phone: string, username: string): Promise<boolean | undefined>{
        const rows = await DBManager.instance().get(`SELECT * FROM Users WHERE email = ? OR phone = ? OR username = ?`, [email, phone, username], "user checking error");
        if(rows && rows.length > 0){
            return true;
        }
        return undefined;
    }

    static async details(userID: string): Promise<UserDetails | undefined>{
        const rows = await DBManager.instance().get(`SELECT * FROM Users WHERE id = ?`, [userID], "user checking error");
        if(rows && rows.length > 0){
            return  { name: rows[0].name, surname: rows[0].surname, username: rows[0].username, email: rows[0].email, phone: rows[0].phone, type: rows[0].type };
        }
        return undefined;
    }

    static async login(credentials:{email?:string, phone?:string, username?: string, password: string, platform?:string }): Promise<{user: UserDetails, sessionID: string}| string | undefined>{
        const rows = await DBManager.instance().get(`SELECT * FROM Users WHERE email = ? OR phone = ? OR username = ?`, [credentials.email, credentials.phone, credentials.username], "email or user does not exits");
        if(rows  && rows.length > 0){
            const result = rows[0];
            if(result.password === credentials.password){
                const session = new Session();
                const id = await session.create(result.id, credentials.platform || "blimited");
                if(id){
                    return { sessionID: id, user: { name: result.name, surname: result.surname, username: result.username, email: result.email, phone: result.phone, type: result.type } };
                }
            }else{
                return "incorrect password, please try again";
            }
        }else if(!DBManager.instance().errorHandler.has_error()){
            return "account with this email address or phone number not found";
        }
        return undefined;
    }

    static async get_id(credentials:{email?:string, phone?:string, username?: string }): Promise<number | undefined>{
        const rows = await DBManager.instance().get(`SELECT id FROM Users WHERE email = ? OR phone = ? OR username = ?`, [credentials.email, credentials.phone, credentials.username], "identifying user error");
        if(rows && rows.length > 0){
            return  rows[0].id;
        }else if(rows && rows.length <= 0){
            DBManager.instance().errorHandler.add(500, "", "user does not exists");
        }
        return undefined;
    }

    static async create(fname: string, username: string, email: string, phone: string, password: string, platform: string = "blimited"): Promise<number | undefined>{
        if(await this.check_users(email, phone, username)){
            DBManager.instance().errorHandler.add(500, "", "user with the same email or phone number already exists");
        }else{
            const name = fname.split(" ")[0];
            const surname = fname.split(" ")[1];

            return await DBManager.instance().insert(`INSERT INTO Users(name, surname, username, email, phone, password) VALUES(?, ?, ?, ?, ?, ?)`, [ name, surname, username, email, phone, password], "user registration failed");
        }
        return undefined;
    }
}