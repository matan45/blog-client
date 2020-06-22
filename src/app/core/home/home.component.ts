import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PostResponse } from '../entities/PostResponsePayload';
import { PostState } from '../store/post.state';
import { FetchPosts } from '../store/post.actions';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [trigger('listAnimation', [
    transition('* => *', [ // each time the binding value changes
      query(':enter', [
        style({ opacity: 0 }),
        stagger(100, [
          animate('0.5s', style({ opacity: 1 }))
        ])
      ], { optional: true })
    ])
  ])],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Select(PostState.getPosts) posts: Observable<PostResponse[]>;
  @Select(PostState.getMassage) massage: Observable<string>;
  public showlist: PostResponse[] = [];
  page: number = 0;

  constructor(private store: Store) { }


  ngOnInit(): void {
    this.store.dispatch(new FetchPosts(this.page));
    this.posts.subscribe(data => {
      console.log({data})
      for (let i = 0; i < data.length; i++) {
        this.showlist.push(data[i]);
      }
    });
  }



  @HostListener("window:scroll", [])
  onScroll(): void {
    this.massage.subscribe(data => {
      if (data === '') {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
          this.store.dispatch(new FetchPosts(++this.page));
          window.scrollTo(0, window.screen.availHeight - (window.screen.availHeight / 2));
        }
      }
    });
  }

  
}
