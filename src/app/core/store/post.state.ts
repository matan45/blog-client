import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PostService } from '../post.service';
import { CreatePost, FetchPosts, PostById, CreateComment } from './post.actions';
import { PostResponse } from '../entities/PostResponsePayload';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';


export class PostStateModel {
    posts: PostResponse[];
    post: PostResponse;
}

@State<PostStateModel>({
    name: 'Post',
    defaults: {
        posts: [],
        post: {
            comments: [],
            createdDate: new Date(),
            description: '',
            editDate: null,
            postId: '',
            postTitle: '',
            userName: ''
        }
    }

})
@Injectable({
    providedIn: "root",
})
export class PostState {
    constructor(private post: PostService, private router: Router) { }

    @Selector()
    static getPosts(state: PostStateModel) {
        return state.posts;
    }

    @Selector()
    static getPost(state: PostStateModel) {
        return state.post;
    }


    @Action(CreatePost)
    Postcreate(
        { getState, patchState, dispatch }: StateContext<PostStateModel>,
        { payload }: CreatePost
    ) {
        this.post.create(payload).subscribe(() => {
            this.router.navigateByUrl('').then(() => {
                dispatch(new FetchPosts());
            });
        }, error => {
            throwError(error);
        });
    }

    @Action(FetchPosts)
    Fetchposts(
        { getState, patchState }: StateContext<PostStateModel>
    ) {
        this.post.fetchposts().subscribe(data => {
            patchState({
                posts: data.reverse()
            });
        });
    }

    @Action(PostById)
    Fetchpost(
        { getState, patchState }: StateContext<PostStateModel>,
        { payload }: PostById
    ) {
        this.post.fetchpost(payload).subscribe(data => {
            patchState({
                post: data
            });
        }, error => {
            throwError(error);
        });
    }

    @Action(CreateComment)
    Commentcreate(
        { getState, patchState, dispatch }: StateContext<PostStateModel>,
        { payload }: CreateComment
    ) {
        this.post.createComment(payload).subscribe(() => {
            dispatch(new PostById(payload.postId));
        }, error => {
            throwError(error);
        });
    }

    
}