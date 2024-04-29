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

export class reqUpdatePassword {
    newPassword?: string
    confirmNewPassword?: string
}

export class reqUpdateUser {
    email?: string
    fullName?: string
}

