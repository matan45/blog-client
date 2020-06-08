import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostPayload } from '../entities/postPayload';
import { AuthService } from 'src/app/auth/auth.service';
import { Store, Select } from '@ngxs/store';
import { CreatePost } from '../store/post.actions';
import { Observable } from 'rxjs';
import { PostState } from '../store/post.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  PostForm: FormGroup;
  postPayload: PostPayload;

  constructor(private auth: AuthService, private store: Store,private router: Router) {

    this.postPayload = {
      postTitle: '',
      description: '',
      userEmail: ''
    };
  }

  ngOnInit(): void {
    this.PostForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required])
    });

  }

  submit() {
    this.postPayload.postTitle = this.PostForm.get('title').value;
    this.postPayload.description = this.PostForm.get('description').value;
    this.postPayload.userEmail = this.auth.getEmail();
    this.store.dispatch(new CreatePost(this.postPayload));
    this.router.navigateByUrl('')
  }

}
