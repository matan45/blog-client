export interface LoginResponse {
    authenticationToken: string;
    refreshToken: string;
    expiresAt: Date;
    email: string;
    username: string;
}