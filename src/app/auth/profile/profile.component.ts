import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth.state';
import { UserDetails } from '../Entities/UserProfile';
import { UserProfile } from '../store/auth.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Select(AuthState.getUserProfile) user: Observable<UserDetails>;
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new UserProfile());
  }

}
