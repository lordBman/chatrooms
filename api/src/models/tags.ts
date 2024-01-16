import { DBManager } from "../config";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import { toSlurg } from "../utils";

export interface TagDetails{
    slurg: string,
    name: string
}

class Tag{
    static async get(roomID: number): Promise<TagDetails[] | undefined>{
        try{
            const result = await DBManager.instance().client.tag.findMany({ where: { roomID } });
            if(result){
                return result;
            }
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting tags");
        }
        return undefined;
    }

    static async create(roomID: number, tags: string[]): Promise<TagDetails| undefined>{
        try{
            const result = tags.map(async (tag)=>{
                let slurg = toSlurg(tag);
                const existingRecord = await DBManager.instance().client.tag.findMany({
                    where: { AND: [ {slurg}, { roomID } ] },
                });
                  
                if (existingRecord.length === 0) {
                    return await DBManager.instance().client.tag.create({
                        data: { slurg, name: tag, roomID },
                    });
                }else{
                    return existingRecord[0];
                }
            });
        }catch(error){
            DBManager.instance().errorHandler.add(HttpStatusCodes.INTERNAL_SERVER_ERROR, `${error}`, "error encountered while getting tags");
        }
        return undefined;
    }
}