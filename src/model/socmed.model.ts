export class socmedCreateRequest {
    name: string
    link: string
}

export class socmedUpdateRequest {
    name?: string
    link?: string
}

export class socmedResponse {
    id: string
    name: string
    link: string
    createdAt: Date
    updatedAt: Date
}