import { DBManager } from "./database";
import uuid from "../utils";

export default class Session{

    private async check_users(userID: string, platform:string = "blimited"): Promise<boolean | undefined>{
        const rows = await DBManager.instance().get(`SELECT * FROM Sessions WHERE userID = ? AND platform = ?`, [userID, platform], "session error");
        if(rows && rows.length > 0){
            return true;
        }
        return undefined;
    }
		
    async get(id: string, platform:string = "blimited"): Promise<string | undefined>{
        const rows = await DBManager.instance().get(`SELECT userID FROM Sessions WHERE id = ? AND platform = ?`, [id, platform], "Sessions error");
        if(rows){
            if(rows && rows.length > 0){
                return rows[0].userID;
            }else{
                DBManager.instance().errorHandler.add(404, "", "session not found or expired");
            }
        }
        return undefined;
    }
		
	async create(userID: string, platform:string = "blimited"): Promise<string | undefined>{
        const token = uuid();
        const check_result = await this.check_users(userID, platform);

        if(check_result && await this.delete(userID, platform)){
            return await this.create(userID, platform);
        }else{
            const init = await DBManager.instance().insert(`INSERT INTO Sessions(id, userID, platform) VALUES(?, ?, ?)`, [token, userID, platform], "unable to create session");
            if(init){
                return token;
            }
        }
        return undefined;
    }
		
	async delete(userID: string, platform:string = "blimited"): Promise<boolean | undefined>{
        const init = await DBManager.instance().update(`DELETE from Sessions WHERE userID = ? AND platform = ?`, [userID, platform], "unable to delete previous session");
        if(init){
            return true;
        }
        return undefined;
	}
}
