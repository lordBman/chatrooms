import { DBManager } from ".";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import uuid from "../utils";

export default class Session{

    private async check_users(userID: number): Promise<boolean | undefined>{
        const result = await DBManager.instance().db.session.findFirst({ where:{ userID: userID }});
        if(result){
            return true;
        }
        return undefined;
    }
		
    async get(id: string): Promise<number | undefined>{
        try{
            const result = await DBManager.instance().db.session.findFirst({ where:{ id: id }});
            if(result){
                return result.userID;
            }else{
                DBManager.instance().errorHandler.add(HttpStatusCodes.NOT_FOUND, "", "session not found or expired");
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.NOT_FOUND, `${error}`, "session not found or expired");
        }
        return undefined;
    }
		
	async create(userID: number): Promise<string | undefined>{
        const token = uuid();
        const check_result = await this.check_users(userID);

        if(check_result && await this.delete(userID)){
            return await this.create(userID);
        }else{
            try{
                const init = await DBManager.instance().db.session.create({ data: { userID: userID, id: token } });
                if(init){
                    return token;
                }
            }catch(error){
                DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "session error");
            }
        }
        return undefined;
    }
		
	async delete(userID: number): Promise<boolean | undefined>{
        try{
            const init = await DBManager.instance().db.session.delete({ where: { userID: userID } });
            if(init){
                return true;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "session error");
        }
        return undefined;
	}
}
