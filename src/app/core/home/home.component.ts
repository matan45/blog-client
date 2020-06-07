import { Component, OnInit, OnChanges } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PostResponse } from '../entities/PostResponsePayload';
import { PostState } from '../store/post.state';
import { FetchPosts } from '../store/post.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Select(PostState.getPosts) posts: Observable<PostResponse[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new FetchPosts());
  }

}
