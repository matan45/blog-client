import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RegisterRequest } from '../Entities/RegisterRequestPayload';
import { Store, Select } from '@ngxs/store';
import { SignUp } from '../store/auth.actions';
import { AuthState } from '../store/auth.state';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import * as moment from 'moment';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  signupRequestPayload: RegisterRequest;
  @Select(AuthState.getMassage) Massage: Observable<string>;


  constructor(private store: Store, private toastr: ToastrService, private authService: AuthService, private formBuilder: FormBuilder) {
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: '',
      created: ''
    }
  }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required,
      // check whether the entered password has a number
      CustomValidators.patternValidator(/\d/, {
        hasNumber: true
      }),
      // check whether the entered password has upper case letter
      CustomValidators.patternValidator(/[A-Z]/, {
        hasCapitalCase: true
      }),
      // check whether the entered password has a lower case letter
      CustomValidators.patternValidator(/[a-z]/, {
        hasSmallCase: true
      }),
      // check whether the entered password has a special character
      CustomValidators.patternValidator(
        /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        {
          hasSpecialCharacters: true
        }
      )
        , Validators.minLength(8)]]
    }, {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
    });
  }

  registerUser() {
    this.signupRequestPayload.email = this.registerForm.get('email').value;
    this.signupRequestPayload.username = this.registerForm.get('username').value;
    this.signupRequestPayload.password = this.registerForm.get('password').value;
    this.signupRequestPayload.created = moment().format().toString();
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
      if (socialusers != null) {
        this.signupRequestPayload = {
          username: socialusers.name,
          email: socialusers.email,
          password: socialusers.name,
          created: moment().format().toString()
        };
        this.signup();
      }
    }, error => {
      console.log(error);
    });
  }

}
