import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PostResponse } from '../entities/PostResponsePayload';
import { Select, Store } from '@ngxs/store';
import { PostState } from '../store/post.state';
import { PostById, CreatedByUser, DeletPost } from '../store/post.actions';
import { CommentsRequest } from '../entities/CommentsRequestPayload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import * as moment from 'moment';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Comment } from '../entities/CommentPayload';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit, OnDestroy {
  @Select(PostState.getPost) post: Observable<PostResponse>;
  @Select(PostState.getisCreatedByUser) isEdit: Observable<boolean>;
  @Select(PostState.getPostSpanner) spinner: Observable<boolean>;
  commentRequest: CommentsRequest;
  commentForm: FormGroup;
  postId: string;
  public islogin: boolean = false;
  public showComments: Comment[] = [];
  topicSubscription: Subscription;
  comment: Comment;


  constructor(private route: ActivatedRoute, private store: Store, private auth: AuthService, private rxStompService: RxStompService) {
    this.commentRequest = {
      postId: '',
      text: '',
      userName: '',
      createdDate: '',
      userEmail: ''
    };
    this.islogin = this.auth.isLoggedIn();
  }


  ngOnInit(): void {
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
    this.topicSubscription = this.rxStompService.watch(`/post/${this.postId}`).subscribe((message: Message) => {
      this.comment = JSON.parse(message.body);
      this.showComments.push(this.comment);

    });
    if (this.islogin) {
      this.store.dispatch(new CreatedByUser(this.postId));
    }
    this.post.subscribe(data => {
      this.showComments = data.comments;
    });
  }

  deletepost() {
    if (confirm("are you sure you want to delete this post?")) {
      this.store.dispatch(new DeletPost(this.postId));
    }
  }

  submit() {
    this.commentRequest.text = this.commentForm.get('text').value;
    this.commentRequest.postId = this.postId;
    this.commentRequest.userName = this.auth.getUserName();
    this.commentRequest.createdDate = moment().format('DD-MM-YYYY HH:mm').toString();
    this.commentRequest.userEmail = this.auth.getEmail();
    this.rxStompService.publish({ destination: '/app/send/post', body: JSON.stringify(this.commentRequest) });
    this.commentForm.reset();
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }
}
