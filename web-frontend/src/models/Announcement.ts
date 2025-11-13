import type { UserProfile } from "./User";

export type Announcement = {
    _id: String;
    title: string;
    content: string;
    creator: UserProfile;
    createdAt: Date;
}