export class eventCreateRequest {
    name: string
    desc?: string
    // images?: JSON
}
export class eventUpdateRequest {
    name?: string
    desc?: string
    // images?: JSON
}

export class eventResponse {
    id?: string
    name?: string
    desc?: string
    images?: JSON
    createdAt?: Date
    updatedAt?: Date
}