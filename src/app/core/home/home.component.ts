import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
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
  page: number = 0;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new FetchPosts(this.page));
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      this.store.dispatch(new FetchPosts(++this.page));
      window.scrollTo(0,window.screen.availHeight);
    }
  }

}
