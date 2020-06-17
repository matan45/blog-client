import { RegisterRequest } from '../Entities/RegisterRequestPayload';
import { LoginRequest } from '../Entities/LoginRequestPayload';
import { EditUserRequest } from '../Entities/EditUserPayload';

export class SignUp {
    static readonly type = "[Auth]Sign-Up";
    constructor(public payload: RegisterRequest ) {}
}

export class EditUser {
  static readonly type = "[Auth]Edit-User";
  constructor(public payload: EditUserRequest ) {}
}


export class Login {
  static readonly type = "[Auth]Log-in";
  constructor(public payload: LoginRequest ) {}
}

export class LogOut {
  static readonly type = "[Auth]Log-out";
}

export class CheckLogin {
  static readonly type = "[Auth]check-Login";
}

export class UserProfile {
  static readonly type = "[Auth]user-profile";
}

export class DeleteUser {
  static readonly type = "[Auth]user-delete";
}