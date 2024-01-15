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

export type{ ErrorResponse, User, Profile };