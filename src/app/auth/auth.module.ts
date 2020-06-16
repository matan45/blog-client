import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { AuthState } from './store/auth.state';
import { NgxsModule } from '@ngxs/store';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LoginOpt } from "angularx-social-login";
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from '../auth/profile/profile.component';
import { ToggleDirective } from './Entities/toggle.directive';


const fbLoginOptions: LoginOpt = {
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
 
const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
 

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("597672953301-ql0dhvginsn7cjcqlsmsvmbr2k1jfb75.apps.googleusercontent.com",googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("3046051098811943",fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    ToggleDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    NgxsModule.forFeature([AuthState]),
    NgxWebstorageModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    AuthState
  ]
})
export class AuthModule { }
