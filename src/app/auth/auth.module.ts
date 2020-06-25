import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
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
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { environment } from 'src/environments/environment';
import { environment as prod } from 'src/environments/environment.prod';
import { dev } from '../profile';



const fbLoginOptions: LoginOpt = {
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

const googleKey = dev ? environment.googleKey : prod.googleKey;
const facebookKey = dev ? environment.facebookKey : prod.facebookKey;
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(googleKey, googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(facebookKey, fbLoginOptions)
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
    ToggleDirective,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    RecaptchaV3Module,
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
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LdkcKcZAAAAABH4GT-4R_WCI-Zi8T_0_G-j-IMB' },
    AuthState
  ]
})
export class AuthModule { }
