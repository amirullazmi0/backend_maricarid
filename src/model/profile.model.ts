export class profileCreateRequest {
    name: string
    desc?: string
}

export class profileUpdateRequest {
    name?: string
    desc?: string
}

export class profileResponse {
    name?: string
    desc?: string
    createdAt?: Date
    updatedAt?: Date
}