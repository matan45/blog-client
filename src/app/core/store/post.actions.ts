import { PostPayload } from '../entities/postPayload';
import { CommentsRequest } from '../entities/CommentsRequestPayload';
import {  EditPostPayload } from '../entities/EditPostPayload';

export class CreatePost {
    static readonly type = "[Post]create-post";
    constructor(public payload: PostPayload) { }
}

export class FetchPosts {
    static readonly type = "[Post]fetch-posts";
    constructor(public payload: number) { }
}

export class PostById {
    static readonly type = "[Post]post-By-id";
    constructor(public payload: string) { }
}

export class CreateComment {
    static readonly type = "[Post]create-comment";
    constructor(public payload: CommentsRequest) { }
}

export class CreatedByUser {
    static readonly type = "[Post]is-Created-By-User";
    constructor(public payload: string) { }
}

export class DeletPost {
    static readonly type = "[Post]Delete-post";
    constructor(public payload: string) { }
}

export class EditPost {
    static readonly type = "[Post]edit-post";
    constructor(public payload: EditPostPayload) { }
}