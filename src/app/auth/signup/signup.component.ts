import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterRequest } from '../Entities/RegisterRequestPayload';
import { Store, Select } from '@ngxs/store';
import { SignUp } from '../store/auth.actions';
import { AuthState } from '../store/auth.state';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  signupRequestPayload: RegisterRequest;
  @Select(AuthState.getMassage) Massage: Observable<string>;
 

  constructor(private store: Store, private toastr: ToastrService, private authService: AuthService) {
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''
    }
  }


  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  registerUser() {
    this.signupRequestPayload.email = this.registerForm.get('email').value;
    this.signupRequestPayload.username = this.registerForm.get('username').value;
    this.signupRequestPayload.password = this.registerForm.get('password').value;
    this.signup();
  }

  signup() {
    this.store.dispatch(new SignUp(this.signupRequestPayload));
    this.Massage.subscribe(data => {
      if (data.length > 1) {
        if (data.indexOf('ERROR') !== -1) {
          this.toastr.error(data);
        } else {
          this.toastr.success(data);
        }
      }
    });
  }

  public socialSignIn(socialProvider: string) {
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.authService.signIn(socialPlatformProvider).then(socialusers => {
      this.signupRequestPayload = {
        username: socialusers.name,
        email: socialusers.email,
        password: socialusers.name
      };
      this.signup();
    });
  }

 
}
