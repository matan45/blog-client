import { Comment } from './CommentPayload';

export interface PostResponse {
    postId: string;
    userName: string;
    postTitle: string;
    description: string;
    createdDate: string;
    editDate: string;
    comments: Comment[];
}