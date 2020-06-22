import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostPayload } from '../entities/postPayload';
import { Store, Select } from '@ngxs/store';
import { CreatePost, PostById, EditPost } from '../store/post.actions';
import { ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { PostResponse } from '../entities/PostResponsePayload';
import { PostState } from '../store/post.state';
import { EditPostPayload } from '../entities/EditPostPayload';
import * as moment from 'moment';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Select(PostState.getPost) post: Observable<PostResponse>;
  @Select(PostState.getPostSpanner) spinner: Observable<boolean>;
  PostForm: FormGroup;
  postPayload: PostPayload;
  editPostPayload: EditPostPayload;
  public postMode: string;
  postId: string;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.postPayload = {
      postTitle: '',
      description: '',
      createdDate: ''
    };
    this.editPostPayload = {
      postId: '',
      postTitle: '',
      description: '',
      editDate: ''
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

      this.store.dispatch(new PostById(this.postId));
      this.post.subscribe(data => {
        this.PostForm = new FormGroup({
          title: new FormControl(data.postTitle, Validators.required),
          description: new FormControl(data.description, [Validators.required])
        });
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
    this.postPayload.createdDate = moment().format('DD-MM-YYYY').toString();
    this.store.dispatch(new CreatePost(this.postPayload));
  }

  editPost() {
    this.editPostPayload.postTitle = this.PostForm.get('title').value;
    this.editPostPayload.description = this.PostForm.get('description').value;
    this.editPostPayload.editDate = moment().format('DD-MM-YYYY').toString();
    this.editPostPayload.postId = this.postId;
    this.store.dispatch(new EditPost(this.editPostPayload));
  }

}



