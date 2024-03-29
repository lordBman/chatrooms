import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { toSlurg } from "../utils";

export interface TagDetails{
    slurg: string,
    name: string
}

export default class Tag{
    static async get(roomID: number): Promise<TagDetails[] | undefined>{
        try{
            const result = await DBManager.instance().db.tag.findMany({ where: { roomID } });
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting tags");
        }
        return undefined;
    }

    static async create(roomID: number, tags: string[]): Promise<TagDetails[]| undefined>{
        try{
            let result = [];
            for(const tag in tags){
                let slurg = toSlurg(tag);
                const existingRecord = await DBManager.instance().db.tag.findMany({
                    where: { AND: [ {slurg}, { roomID } ] },
                });
                  
                if (existingRecord.length === 0) {
                    result.push(await DBManager.instance().db.tag.create({
                        data: { slurg, name: tag, roomID },
                    }));
                }else{
                    result.push(existingRecord[0]);
                }
            }
            return result;
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting tags");
        }
        return undefined;
    }
}