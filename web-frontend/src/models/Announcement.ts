import type { UserProfile } from "./User";

export type Announcement = {
    _id: String;
    title: String;
    content: String;
    creator: UserProfile;
    createdAt: Date;
}