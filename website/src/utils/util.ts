import { Likes, User } from "./response";
import { LooseObject } from "./types";

export default class Util{
    public static HomeUrl = "http://localhost:2000/";
    public static months = ["January", "Feburary", "Match", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"];
    public static colors = ["#4F8CD2", "#D1273B", "#FF9155", "#49AD2C", "#B7579D", "grey"]

    public static getDate(date: string):string{
        let init = new Date(date);
        let day = init.getDate().toString();
        
    
        let month = Util.months[init.getMonth() - 1];
        return day + " " + month + " " + init.getFullYear();
    }
    
    public static getTime(date: string):string{
        let init = new Date(date);
        return init.getHours() + ":" + init.getMinutes();
    }

    public static replaceAll(data: string, word: string, replacement: string): string{
        let init = "";
        let index = 0;
        while(index < data.length - word.length){
            let current = data.substring(index, word.length);
            if(current === word){
                init += replacement;
                index += word.length;
            }else{
                index += 1;
            }
        }
        return init;
    }

    public static extract(form: HTMLFormElement): LooseObject{
        const formData = new FormData(form);

        // Create an empty object to store the key-value pairs
        let obj: LooseObject = {};

        // Loop through the entries of the FormData object
        formData.forEach((value, key) => {
            // Assign each value to the corresponding key in the object
            obj[key] = value.toString();
        });

        return obj;
    }

    public static likesCount(likes: Likes[], user?: User,): { likes: number, dislikes: number, iLike?: boolean }{
        let initLike = 0;
        let initDislike = 0;
        let iLike: boolean | undefined;

        likes.forEach((like)=>{
            if(user && user.username === like.user.username){
                iLike = like.like!;
            }
            if(like.like){
                initLike += 1;
            }else{
                initDislike += 1;
            }
        });

        return { likes: initLike, dislikes: initDislike, iLike };
    }
}