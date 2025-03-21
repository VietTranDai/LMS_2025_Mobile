export const AUTH_KEY = 'auth_data';

export type LoginData = {
    token: string;
    user: {
        id: string;
        email: string;
    };
};