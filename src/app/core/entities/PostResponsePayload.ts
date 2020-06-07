import { Comment } from './CommentPayload';

export interface PostResponse {
    postId: string;
    userName: string;
    postTitle: string;
    description: string;
    createdDate: Date;
    editDate: Date;
    comments: Comment[];
}