import Comment from "./comments"
import Member from "./members";
import Profile from "./profile";
import Room from "./rooms";
import Tag from "./tags";
import User from "./users";

export interface Likes{
    user: User,
    like: boolean | null
}

export { Comment, Member, Profile, Room, Tag, User }