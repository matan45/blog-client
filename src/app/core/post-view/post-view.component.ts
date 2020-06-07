import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostResponse } from '../entities/PostResponsePayload';
import { Select, Store } from '@ngxs/store';
import { PostState } from '../store/post.state';
import { PostById, CreateComment } from '../store/post.actions';
import { CommentsRequest } from '../entities/CommentsRequestPayload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  @Select(PostState.getPost) post: Observable<PostResponse>;
  commentRequest: CommentsRequest;
  commentForm: FormGroup;
  postId: string;
  public islogin: boolean = false;

  constructor(private route: ActivatedRoute, private store: Store, private auth: AuthService) {
    this.commentRequest = {
      postId: '',
      text: '',
      userName: ''
    };
  }

  ngOnInit(): void {
    this.islogin = this.auth.isLoggedIn();
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });

    this.route.paramMap.subscribe(() => {
      this.getPostparam();
    });
  }

  getPostparam() {
    this.postId = this.route.snapshot.paramMap.get("id");
    this.store.dispatch(new PostById(this.postId));
  }

  submit() {
    this.commentRequest.text = this.commentForm.get('text').value;
    this.commentRequest.postId = this.postId;
    this.commentRequest.userName = this.auth.getUserName();
    this.store.dispatch(new CreateComment(this.commentRequest));
  }
}
