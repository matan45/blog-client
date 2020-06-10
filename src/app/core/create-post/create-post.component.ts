import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostPayload } from '../entities/postPayload';
import { AuthService } from 'src/app/auth/auth.service';
import { Store, Select } from '@ngxs/store';
import { CreatePost } from '../store/post.actions';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
    if (this.postMode === "create") {
      this.PostForm = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', [Validators.required])
      });
    } else {
      this.post.subscribe(data => {
        this.PostForm = new FormGroup({
          title: new FormControl(data.postTitle, Validators.required),
          description: new FormControl(data.description, [Validators.required])
        });
      });

    }
  }

  submit() {
    this.postPayload.postTitle = this.PostForm.get('title').value;
    this.postPayload.description = this.PostForm.get('description').value;
    this.postPayload.userEmail = this.auth.getEmail();
    this.store.dispatch(new CreatePost(this.postPayload));
  }

}
