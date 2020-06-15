import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { LoginRequest } from './Entities/LoginRequestPayload';
import { LoginResponse } from './Entities/LoginResponesPayload';
import { map, tap } from 'rxjs/operators';
import { RegisterRequest } from './Entities/RegisterRequestPayload';
import { RefreshTokenPayload } from './Entities/RefreshTokenPayload';
import { environment } from 'src/environments/environment';
import { environment as prod } from 'src/environments/environment.prod';
import { UserDetails } from './Entities/UserProfile';

@Injectable()
export class AuthService {

  readonly serverURL = environment.production ? prod.ServerUrl : environment.ServerUrl;

  refreshTokenPayload: RefreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    email: this.getEmail()
  };

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) { }

  login(loginRequestPayload: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(`${this.serverURL}/api/auth/login`, loginRequestPayload)
      .pipe(map(data => {
        this.refreshTokenPayload = {
          refreshToken: data.refreshToken,
          email: data.email
        };
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('email', data.email);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        this.localStorage.store('username', data.username);
        return true;
      }));
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>(`${this.serverURL}/api/auth/refresh/token`,
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.store('authenticationToken', response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  register(registerPayload: RegisterRequest): Observable<any> {
    return this.httpClient.post(`${this.serverURL}/api/auth/signup`, registerPayload, { responseType: 'text' });
  }

  userProfile(): Observable<UserDetails> {
    return this.httpClient.get<UserDetails>(`${this.serverURL}/api/user/profile`).pipe(map(response => response));
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() !== null;
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getExpirationTime() {
    return this.localStorage.retrieve('expiresAt');
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }

  getEmail() {
    return this.localStorage.retrieve('email');
  }

  logout() {
    this.httpClient.post(`${this.serverURL}/api/auth/logout`, this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('email');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('username');

  }

  deletuser() {
    this.httpClient.delete(`${this.serverURL}/api/user/delete`,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('email');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('username');

  }
}
