export interface ErrorResponse{
    message: string;
}

export interface User{
    username: string,
    email: string,
    profile?: Profile
}

export interface Profile{
    description?: string,
    path?: string
}

export interface Comment{
    id: number,
    message: string,
    user: User,
    attachment: string | null,
    posted: string,
    likes: Likes[]
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
    tags: Tag[],
    likes: Likes[]
}

export interface Likes{
    user: User,
    like: boolean | null
}