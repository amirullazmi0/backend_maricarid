export class authRegisterRequest {
    email: string
    fullName: string
    password: string
    token?: string
}

export class authLoginRequest {
    email: string
    password: string
}

export class authUpdateRequest {
    email: string
    fullName?: string
    password: string
    token?: string
}

export class authResponse {
    email?: string
    fullName?: string
    password?: string
    token?: string
    createdAt?: Date
    updatedAt?: Date
}