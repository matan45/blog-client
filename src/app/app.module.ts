import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './core/header/header.component';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './core/home/home.component';
import { TokenInterceptor } from './token-interceptor';
import { CreatePostComponent } from './core/create-post/create-post.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular'
import { PostState } from './core/store/post.state';
import { PostViewComponent } from './core/post-view/post-view.component';
import { ShortenPipe } from './core/shorten.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './core/post-view/my-rx-stomp.config';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ShortenPipe,
    CreatePostComponent,
    PostViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    AuthModule,
    NgxsModule.forRoot([PostState]),
    !environment.production ? NgxsReduxDevtoolsPluginModule.forRoot():[] ,
    !environment.production ? NgxsLoggerPluginModule.forRoot():[],
    NgbModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
