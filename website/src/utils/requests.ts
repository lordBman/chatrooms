interface SignUpRequest{
    username: string, email:string, password: string, repassword: string
}

interface LoginRequest{
    email: string, password: string
}

export type { SignUpRequest, LoginRequest }