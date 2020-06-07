import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostPayload } from './entities/postPayload';
import { environment } from 'src/environments/environment';
import { PostResponse } from './entities/PostResponsePayload';
import { map } from 'rxjs/operators';
import { CommentsRequest } from './entities/CommentsRequestPayload';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  create(postPayload: PostPayload): Observable<any> {
    return this.httpClient.post(`${environment.ServerUrl}/api/posts/`, postPayload);
  }

  fetchposts(): Observable<PostResponse[]> {
    return this.httpClient.get<PostResponse[]>(`${environment.ServerUrl}/api/posts/query/all`).pipe(map(response => response));
  }

  fetchpost(postId:string): Observable<PostResponse> {
    return this.httpClient.get<PostResponse>(`${environment.ServerUrl}/api/posts/${postId}`).pipe(map(response => response));
  }

  createComment(commentPayload: CommentsRequest): Observable<any> {
    return this.httpClient.post(`${environment.ServerUrl}/api/comments/`, commentPayload);
  }
}
