import { PostPayload } from '../entities/postPayload';
import { CommentsRequest } from '../entities/CommentsRequestPayload';

export class CreatePost {
    static readonly type = "[Post]create-post";
    constructor(public payload: PostPayload) { }
}

export class FetchPosts {
    static readonly type = "[Post]fetch-posts";
}

export class PostById {
    static readonly type = "[Post]post-By-id";
    constructor(public payload: string) { }
}

export class CreateComment {
    static readonly type = "[Post]create-comment";
    constructor(public payload: CommentsRequest) { }
}