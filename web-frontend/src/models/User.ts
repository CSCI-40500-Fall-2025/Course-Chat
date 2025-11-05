export type UserProfileToken = {
    user: {
        username: string;
        email: string;
        profileImageURL: string;
    }
    token: string;
};

export type UserProfile = {
    username: string;
    email: string;
    profileImageURL: string;
};