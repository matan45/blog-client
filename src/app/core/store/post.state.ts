import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PostService } from '../post.service';
import { CreatePost, FetchPosts, PostById, CreatedByUser, DeletPost, EditPost, PostLogOut } from './post.actions';
import { PostResponse } from '../entities/PostResponsePayload';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';


export class PostStateModel {
    posts: PostResponse[];
    post: PostResponse;
    isCreatedByUser: boolean;
    massage: String;
    postspinner: boolean;
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
        isCreatedByUser: false,
        massage: '',
        postspinner:false
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

    
    @Selector()
    static getPostSpanner(state: PostStateModel) {
        return state.postspinner;
    }

    @Selector()
    static getMassage(state: PostStateModel) {
        return state.massage;
    }

    @Action(CreatePost)
    Postcreate(
        { getState, patchState, dispatch }: StateContext<PostStateModel>,
        { payload }: CreatePost
    ) {
        patchState({
            postspinner:true
        });
        this.post.create(payload).subscribe(() => {
            patchState({
                postspinner:false
            });
            this.router.navigateByUrl('').then(() => {
                dispatch(new FetchPosts(0));
            });
        }, error => {
            patchState({
                postspinner:false
            });
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
        patchState({
            massage: 'Loading...'
        });
        this.post.fetchposts(payload).subscribe(data => {
            if (data.length > 0) {
                patchState({
                    posts: data,
                    massage: ''
                });
            } else {
                patchState({
                    massage: 'No More Posts'
                })
            }
        });
    }

    @Action(PostById)
    Fetchpost(
        { getState, patchState,dispatch }: StateContext<PostStateModel>,
        { payload }: PostById
    ) {
        patchState({
            postspinner:true
        });
        this.post.fetchpost(payload).subscribe(data => {
            patchState({
                post: data,
                postspinner:false
            });
        }, error => {
            patchState({
                postspinner:false
            });
            this.router.navigateByUrl('').then(() => {
                dispatch(new FetchPosts(0));
            });
        });
    }


    @Action(CreatedByUser)
    isCreatedByUserpost(
        { getState, patchState }: StateContext<PostStateModel>,
        { payload }: CreatedByUser
    ) {
        patchState({
            postspinner:true
        });
        getState().isCreatedByUser = false;
        this.post.isCreatedByUser(payload).subscribe(data => {
            patchState({
                isCreatedByUser: data,
                postspinner:false
            });
        }, error => {
            patchState({
                postspinner:false
            });
            throwError(error);
        });
    }

    @Action(DeletPost)
    deletePost(
        { getState, patchState, dispatch }: StateContext<PostStateModel>,
        { payload }: DeletPost
    ) {
        patchState({
            postspinner:true
        });
        this.post.deletepost(payload).subscribe(() => {
            patchState({
                postspinner:false
            });
            this.router.navigateByUrl('').then(() => {
                dispatch(new FetchPosts(0));
            });
        }, error => {
            patchState({
                postspinner:false
            });
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
            this.router.navigateByUrl(`/postView/${postid}`).then(() => dispatch(new PostById(postid)));
        }, error => {
            throwError(error);
        });
    }

    @Action(PostLogOut)
    logout(
        { getState, patchState }: StateContext<PostStateModel>
    ) {
        patchState({
            isCreatedByUser: false,
            postspinner:false
        });

    }
}