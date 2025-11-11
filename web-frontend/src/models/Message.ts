import type { UserProfile } from "./User";

export type Message = {
    _id: string;
    sender: UserProfile;
    content: string;
    createdAt: Date;
}