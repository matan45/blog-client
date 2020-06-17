import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SignUp, Login, LogOut, CheckLogin, UserProfile, DeleteUser, EditUser } from './auth.actions';
import { UserDetails } from '../Entities/UserProfile';
import { throwError } from 'rxjs';


export class AuthStateModel {
    massage: string;
    isLogin: boolean;
    username: string;
    userProfile: UserDetails;
    spanner: boolean;
}

@State<AuthStateModel>({
    name: 'Auth',
    defaults: {
        massage: '',
        isLogin: false,
        username: '',
        spanner: false,
        userProfile: {
            username: '',
            authorities: [],
            commentsNumber: 0,
            created: '',
            email: '',
            posts: []
        }
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
    static getSpanner(state: AuthStateModel) {
        return state.spanner;
    }

    @Selector()
    static getUserProfile(state: AuthStateModel) {
        return state.userProfile;
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
        patchState({
            spanner: true
        });
        const state = getState();
        state.massage = '';
        this.auth.register(payload).subscribe(data => {
            patchState({
                massage: data,
                spanner: false
            });
            this.router.navigate(['/login']);
        }, error => {
            patchState({
                massage: error.error,
                spanner: false
            });
        });
    }

    @Action(Login)
    login(
        { getState, patchState }: StateContext<AuthStateModel>,
        { payload }: Login
    ) {
        patchState({
            spanner: true
        });
        const state = getState();
        state.massage = '';
        this.auth.login(payload).subscribe(data => {
            if (data) {
                patchState({
                    massage: "login successful",
                    isLogin: true,
                    spanner: false,
                    username: this.auth.getUserName()
                });
                this.router.navigate(['/']);
            }
        }, error => {
            patchState({
                massage: error.error,
                spanner: false
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

    @Action(UserProfile)
    userDetails(
        { getState, patchState }: StateContext<AuthStateModel>
    ) {
        patchState({
            spanner: true
        });
        this.auth.userProfile().subscribe(data => {
            patchState({
                userProfile: data,
                spanner: false
            });
        }, error => {
            throwError(error);
            patchState({
                spanner: false
            });
        });
    }

    @Action(EditUser)
    editUser(
        { getState, patchState,dispatch }: StateContext<AuthStateModel>,
        { payload }: EditUser
    ) {
        patchState({
            spanner: true
        });
        const state = getState();
        state.massage = '';
        this.auth.editUser(payload).subscribe(data => {
            patchState({
                massage: data,
                username: payload.username,
                spanner: false
            });
            dispatch(new LogOut());
        }, error => {
            patchState({
                massage: error.error,
                spanner: false
            });
        });
    }

    @Action(DeleteUser)
    deleteuser(
        { getState, patchState }: StateContext<AuthStateModel>
    ) {

        this.auth.deletuser();
        patchState({
            isLogin: false
        });
        this.router.navigate(['/']);
    }
}