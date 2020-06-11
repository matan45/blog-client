import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostPayload } from '../entities/postPayload';
import { AuthService } from 'src/app/auth/auth.service';
import { Store, Select } from '@ngxs/store';
import { CreatePost, PostById } from '../store/post.actions';
import { ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { PostResponse } from '../entities/PostResponsePayload';
import { PostState } from '../store/post.state';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Select(PostState.getPost) post: Observable<PostResponse>;
  PostForm: FormGroup;
  postPayload: PostPayload;
  public postMode: string;
  postId: string;

  constructor(private auth: AuthService, private store: Store, private route: ActivatedRoute) {
    this.postPayload = {
      postTitle: '',
      description: '',
      userEmail: ''
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getPostmode();
    });
  }



  getPostmode() {
    this.postMode = this.route.snapshot.paramMap.get("mode");
    if (this.postMode === "edit") {
      this.postId = this.route.snapshot.paramMap.get("id");
      if (this.postPayload.postTitle.length === 0 || this.postPayload.description.length === 0) {
        this.store.dispatch(new PostById(this.postId));
      }

      this.post.subscribe(data => {
        if (data.postTitle.length === 0 || data.description.length === 0) {
          this.store.dispatch(new PostById(this.postId));
        } else {
          this.PostForm = new FormGroup({
            title: new FormControl(data.postTitle, Validators.required),
            description: new FormControl(data.description, [Validators.required])
          });
        }
      });

    } else {
      this.PostForm = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', [Validators.required])
      });
    }
  }

  submit() {
    if (this.postMode === "edit") {
      this.editPost();
    } else {
      this.createPost();
    }
  }

  createPost() {
    this.postPayload.postTitle = this.PostForm.get('title').value;
    this.postPayload.description = this.PostForm.get('description').value;
    this.postPayload.userEmail = this.auth.getEmail();
    this.store.dispatch(new CreatePost(this.postPayload));
  }

  editPost() {

  }

}



