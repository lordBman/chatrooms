interface ErrorResponse{
    message: string;
}

interface User{
    username: string,
    email: string,
    profile?: Profile
}

interface Profile{
    description?: string,
    path?: string
}

export interface Comment{
    id: number,
    message: string,
    user: User,
    attachment: string | null,
    posted: string
}

export interface Tag{
    slurg: string,
    name: string
}

export interface Room{
    id: number,
    title: string,
    creator: User,
    isPrivate: boolean,
    comments: Comment[],
    attachment: string | null,
    members?: { user: User }[],
    tags: Tag[]
}

export type{ ErrorResponse, User, Profile };