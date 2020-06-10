import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CreatePostComponent } from './core/create-post/create-post.component';
import { AuthGuard } from './auth/auth.guard';
import { PostViewComponent } from './core/post-view/post-view.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "post/:mode", component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: "postView/:id", component: PostViewComponent },
  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
