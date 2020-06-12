import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostPayload } from './entities/postPayload';
import { environment } from 'src/environments/environment';
import { PostResponse } from './entities/PostResponsePayload';
import { map } from 'rxjs/operators';
import { CommentsRequest } from './entities/CommentsRequestPayload';
import { environment as prod } from 'src/environments/environment.prod';
import { EditPostPayload } from './entities/EditPostPayload';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  readonly serverURL = environment.production ? prod.ServerUrl : environment.ServerUrl;;

  constructor(private httpClient: HttpClient) { }

  create(postPayload: PostPayload): Observable<any> {
    return this.httpClient.post(`${this.serverURL}/api/user/`, postPayload);
  }

  fetchposts(page: number): Observable<PostResponse[]> {
    return this.httpClient.get<PostResponse[]>(`${this.serverURL}/api/posts/query/all/${page}`).pipe(map(response => response));
  }

  fetchpost(postId: string): Observable<PostResponse> {
    return this.httpClient.get<PostResponse>(`${this.serverURL}/api/posts/${postId}`).pipe(map(response => response));
  }

  createComment(commentPayload: CommentsRequest): Observable<any> {
    return this.httpClient.post(`${this.serverURL}/api/comments/`, commentPayload);
  }

  isCreatedByUser(postId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.serverURL}/api/user/byUser/${postId}`).pipe(map(response => response));
  }

  editPost(editpostPayload: EditPostPayload): Observable<any> {
    return this.httpClient.put(`${this.serverURL}/api/user/edit`, editpostPayload);
  }

  deletepost(postId: string): Observable<any> {
    return this.httpClient.delete(`${this.serverURL}/api/user/delete/post?postId=${postId}`).pipe(map(response => response));
  }
}
