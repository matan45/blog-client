import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UserDetails } from '../Entities/UserProfile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from '../signup/custom-validators';
import { AuthState } from '../store/auth.state';
import { Observable, Subscription } from 'rxjs';
import { EditUser } from '../store/auth.actions';
import { EditUserRequest } from '../Entities/EditUserPayload';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit,OnDestroy {

  @Input() userDetails:UserDetails;
  @Output() close = new EventEmitter<boolean>();
  registerForm: FormGroup;
  EdituserPayload: EditUserRequest;
  subscription:Subscription;
  @Select(AuthState.getMassage) Massage: Observable<string>;

  constructor(private store: Store, private toastr: ToastrService,private formBuilder: FormBuilder) {
    this.EdituserPayload = {
      username: '',
      email: '',
      password: ''
    }
   }
  

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: [this.userDetails.username, Validators.required],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
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

  EditUser(){
    this.EdituserPayload.email = this.registerForm.get('email').value;
    this.EdituserPayload.username = this.registerForm.get('username').value;
    this.EdituserPayload.password = this.registerForm.get('password').value;
    this.close.emit(true);
    this.store.dispatch(new EditUser(this.EdituserPayload));

    this.subscription.add(this.Massage.subscribe(data => {
      if (data.length > 1) {
        if (data.indexOf('ERROR') !== -1) {
          this.toastr.error(data);
        } else {
          this.toastr.success(data +" you need to Relog in order the effect to take place");
        }
      }
    }));

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
