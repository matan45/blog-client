import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth.state';
import { UserDetails } from '../Entities/UserProfile';
import { UserProfile, DeleteUser } from '../store/auth.actions';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Select(AuthState.getUserProfile) user: Observable<UserDetails>;
  @Select(AuthState.getSpanner) spinner: Observable<boolean>;

  constructor(private store: Store,config: NgbModalConfig,private modalService: NgbModal) {
    config.backdrop = 'static';
   }

  ngOnInit(): void {
    this.store.dispatch(new UserProfile());
  }

  deleteuser(){
    if (confirm("are you sure you want to delete this account?")) {
      this.store.dispatch(new DeleteUser());
    }
  }

  open(content) {
    this.modalService.open(content);
  }

}
