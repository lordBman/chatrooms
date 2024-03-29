import { Response } from "express";
import HttpStatusCodes from "../constants/HttpStatusCodes";

interface Err{
    error: string, message: string
}

class ErrorHandler{
    private errors: { code : HttpStatusCodes, error: Err}[];
    
    public constructor(){
        this.errors = [];
    }
    
    add(code: HttpStatusCodes, error: string, message: string): void{
        const init: Err = { error: error, message: message };
        this.errors.push({ code, error: init });
    }
    
    display(response: Response){
        if(this.errors.length > 0){
            let first = this.errors[0];
            this.errors.forEach((value) =>{
                console.log(value.error.error + "\n");
            });
            this.errors = [];
            return response.status(first.code).json({"message": first.error.message});
        }
        this.errors = [];
        return response.status(500).json({"message": "obsolute server breakdown"});
    }
    
    has_error(): boolean{
        return this.errors.length > 0;
    }
}

export default ErrorHandler;