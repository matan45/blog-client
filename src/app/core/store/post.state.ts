import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PostService } from '../post.service';
import { CreatePost, FetchPosts, PostById, CreateComment, CreatedByUser, DeletPost, EditPost } from './post.actions';
import { PostResponse } from '../entities/PostResponsePayload';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';


export class PostStateModel {
    posts: PostResponse[];
    post: PostResponse;
    isCreatedByUser: boolean;
}

@State<PostStateModel>({
    name: 'Post',
    defaults: {
        posts: [],
        post: {
            comments: [],
            createdDate: '',
            description: '',
            editDate: null,
            postId: '',
            postTitle: '',
            userName: ''
        },
        isCreatedByUser: false
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
    static getisCreatedByUser(state: PostStateModel) {
        return state.isCreatedByUser;
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
                dispatch(new FetchPosts(0));
            });
        }, error => {
            throwError(error);
        });
    }

    @Action(FetchPosts)
    Fetchposts(
        { getState, patchState }: StateContext<PostStateModel>,
        { payload }: FetchPosts
    ) {
        if (payload == 0) {
            getState().posts = [];
        }

        this.post.fetchposts(payload).subscribe(data => {
            if (data.length > 0 && getState().posts.length > 0) {
                const currentpost: PostResponse[] = getState().posts;
                patchState({
                    posts: currentpost.concat(data).reverse()
                });
            } else if (data.length > 0 && getState().posts.length === 0) {
                patchState({
                    posts: data.reverse()
                });
            }
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


    @Action(CreatedByUser)
    isCreatedByUserpost(
        { getState, patchState }: StateContext<PostStateModel>,
        { payload }: CreatedByUser
    ) {
        getState().isCreatedByUser = false;
        this.post.isCreatedByUser(payload).subscribe(data => {
            patchState({
                isCreatedByUser: data
            });
        }, error => {
            throwError(error);
        });
    }

    @Action(DeletPost)
    deletePost(
        { getState, patchState, dispatch }: StateContext<PostStateModel>,
        { payload }: DeletPost
    ) {
        this.post.deletepost(payload).subscribe(() => {
            this.router.navigateByUrl('').then(() => {
                dispatch(new FetchPosts(0));
            });
        }, error => {
            throwError(error);
        });
    }

    @Action(EditPost)
    editpost(
        { getState, patchState, dispatch }: StateContext<PostStateModel>,
        { payload }: EditPost
    ) {
        const postid = payload.postId;
        this.post.editPost(payload).subscribe(() => {
            this.router.navigateByUrl(`/postView/${postid}`).then(()=>dispatch(new PostById(postid)));
        }, error => {
            throwError(error);
        });
    }
}