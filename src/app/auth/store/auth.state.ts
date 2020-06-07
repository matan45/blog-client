import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SignUp, Login, LogOut, CheckLogin } from './auth.actions';


export class AuthStateModel {
    massage: string;
    isLogin: boolean;
    username: string;
}

@State<AuthStateModel>({
    name: 'Auth',
    defaults: {
        massage: '',
        isLogin: false,
        username: ''
    }
})
@Injectable()
export class AuthState {
    constructor(private auth: AuthService, private router: Router) { }

    @Selector()
    static getMassage(state: AuthStateModel) {
        return state.massage;
    }

    @Selector()
    static getUserName(state: AuthStateModel) {
        return state.username;
    }

    @Selector()
    static getisLogin(state: AuthStateModel) {
        return state.isLogin;
    }

    @Action(SignUp)
    register(
        { getState, patchState }: StateContext<AuthStateModel>,
        { payload }: SignUp
    ) {
        const state = getState();
        state.massage = '';
        this.auth.register(payload).subscribe(data => {
            patchState({
                massage: data
            });
            this.router.navigate(['/login']);
        }, error => {
            patchState({
                massage: error.error
            });
        });
    }

    @Action(Login)
    login(
        { getState, patchState }: StateContext<AuthStateModel>,
        { payload }: Login
    ) {
        const state = getState();
        state.massage = '';
        this.auth.login(payload).subscribe(data => {
            if (data) {
                patchState({
                    massage: "login successful",
                    isLogin: true,
                    username: this.auth.getUserName()
                });
                this.router.navigate(['/']);
            }
        }, error => {
            patchState({
                massage: error.error
            });
        });
    }

    @Action(LogOut)
    logout(
        { getState, patchState }: StateContext<AuthStateModel>
    ) {

        this.auth.logout();
        patchState({
            isLogin: false
        });
        this.router.navigate(['/']);
    }

    @Action(CheckLogin)
    islogin(
        { getState, patchState }: StateContext<AuthStateModel>
    ) {
        patchState({
            isLogin: this.auth.isLoggedIn(),
            username: this.auth.getUserName()
        });
    }
}