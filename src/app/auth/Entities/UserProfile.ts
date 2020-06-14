import { PostResponse } from 'src/app/core/entities/PostResponsePayload';

export interface UserDetails {
    username: string;
    email: string;
    created: string;
    authorities: string[];
    commentsNumber: number;
    posts: PostResponse[];
}