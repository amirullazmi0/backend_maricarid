export class clientCreateRequest {
    name: string
    desc?: string
    // images?: JSON
}
export class clientUpdateRequest {
    name?: string
    desc?: string
    // images?: JSON
}

export class clientResponse {
    id?: string
    name?: string
    desc?: string
    images?: JSON
    createdAt?: Date
    updatedAt?: Date
}