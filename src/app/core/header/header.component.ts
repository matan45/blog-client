import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/store/auth.state';
import { LogOut, CheckLogin } from 'src/app/auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Select(AuthState.getisLogin) Login: Observable<boolean>;
  @Select(AuthState.getUserName) username: Observable<string>;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new CheckLogin());
  }

  logout() {
    this.store.dispatch(new LogOut());
  }

}
