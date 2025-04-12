import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private login = new BehaviorSubject<boolean>(true);
  loginS = this.login.asObservable();
  setLogin(status: boolean) {
    this.login.next(status);
  }
  constructor() {}
}
