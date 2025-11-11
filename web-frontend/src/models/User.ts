export type UserProfileToken = {
    user: {
        _id: string;
        username: string;
        email: string;
        profileImageURL: string;
    }
    token: string;
};

export type UserProfile = {
    _id: string;
    username: string;
    email: string;
    profileImageURL: string;
};