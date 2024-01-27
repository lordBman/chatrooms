import { Dirs, FileSystem } from 'react-native-file-access';
import { User, Likes } from './response';

export const saveData = async (filename: string, data: string) => {
    try {
        if(!(await FileSystem.exists(Dirs.DocumentDir))){
            const init = await FileSystem.mkdir(Dirs.DocumentDir);
            console.log(init);
        }else{
            console.log("It does exists");
        }
        const path = `${Dirs.DocumentDir}/${filename}`;

        // Write the data to the file
        await FileSystem.writeFile(path, data, 'utf8');
    } catch (error) {
        console.error(error);
        throw new Error(`Error saving data: ${filename}`); 
    }
  };

  export const retrieveData = async (filename: string) => {
    try {
        const path = `${Dirs.DocumentDir}/${filename}`;
        
        // Read the data from the file
        return await FileSystem.readFile(path);
    } catch (error) {
        console.error('Error retrieving data:', error);
        console.error(error);
        throw new Error(`Error retrieving data: ${filename}`);
    }
};

export const fileExists = async (filename: string) => FileSystem.exists(`${Dirs.DocumentDir}/${filename}`);

export const month = (value: number) =>{
    switch(value){
        case 0:
            return "January";
        case 1:
            return "Feburary";
        case 2:
            return "Match";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "Octomber";
        case 10:
            return "November";
        case 11:
            return "December";
        default:
            return "unknown"
    }
}

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

    public static likesCount(user: User, likes: Likes[]): { likes: number, dislikes: number, iLike?: boolean }{
        let initLike = 0;
        let initDislike = 0;
        let iLike: boolean | undefined;

        likes.forEach((like)=>{
            if(user.username === like.user.username){
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
