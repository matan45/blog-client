import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { CreatePost, FetchPosts, PostById, CreateComment } from './post.actions';
import { PostResponse } from '../entities/PostResponsePayload';


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
    constructor(private router: Router, private post: PostService) { }

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
        { getState, patchState }: StateContext<PostStateModel>,
        { payload }: CreatePost
    ) {
        this.post.create(payload).subscribe(() => {
            this.router.navigateByUrl('').then(() => window.window.location.reload());
        }, error => {
            console.log(error);
        });
    }

    @Action(FetchPosts)
    Fetchposts(
        { getState, patchState }: StateContext<PostStateModel>
    ) {
        this.post.fetchposts().subscribe(data => {
            patchState({
                posts: data
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
        });
    }

    @Action(CreateComment)
    Commentcreate(
        { getState, patchState }: StateContext<PostStateModel>,
        { payload }: CreateComment
    ) {
        this.post.createComment(payload).subscribe(() => {
            window.window.location.reload();
        }, error => {
            console.log(error);
        });
    }

}