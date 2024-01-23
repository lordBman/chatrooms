import Comment from "./comments"
import Member from "./members";
import Profile from "./profile";
import Room from "./rooms";
import Tag from "./tags";
import User from "./users";

export interface CommentLikes{
    user: User,
    commentID: number,
    like: boolean
}

export interface RoomLikes{
    user: User,
    commentID: number,
    like: boolean
}

export { Comment, Member, Profile, Room, Tag, User }