import { SessionType } from "../services/upload.service";

export class Session {
    id: string;
    password: string;
    name: string;
    retention: number;
    created: Date;
    hasPassword: boolean;
    status: SessionStatus;
    sessionType: SessionType;
    size: number;
    user: string;

    constructor(sessionId: string, name?: string) {
        this.id = sessionId;
        this.name= name
    }
}

export enum SessionStatus {
    Created = "Created",
    Deleted = "Deleted"
}
