import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequest } from '../Entities/LoginRequestPayload';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../store/auth.actions';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginRequestPayload: LoginRequest;
  @Select(AuthState.getMassage) Massage: Observable<string>;

  constructor(private store: Store, private toastr: ToastrService, private authService: AuthService) {
    this.loginRequestPayload = {
      email: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.email])
    });
  }

  login() {
    this.loginRequestPayload.email = this.loginForm.get('email').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;
    this.sendlogin();
  }

  sendlogin() {
    this.store.dispatch(new Login(this.loginRequestPayload));
    this.Massage.subscribe(data => {
      if (data.length > 1) {
        if (data.indexOf('ERROR') !== -1) {
          this.toastr.error(data);
        } else {
          this.toastr.info(data);
        }
      }
    });
  }

  public socialLogIn(socialProvider: string) {
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.authService.signIn(socialPlatformProvider).then(socialusers => {
      if(socialusers != null){
        this.loginRequestPayload = {
          email: socialusers.email,
          password: socialusers.name
        };
        this.sendlogin();
      }
    },error=>{
      console.log(error);
    });
  }
}
