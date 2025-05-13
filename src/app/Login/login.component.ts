// declare var google: any;
import { CommonModule } from '@angular/common';
import {
  // AfterViewInit,
  Component,
  // ElementRef
  // ViewChild,
  inject,
} from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputControleComponent } from '../input-text/input-controle.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, InputControleComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // url = baseUrl;
  http = inject(HttpClient);
  _loginService = inject(LoginService);
  _Router = inject(Router);
  loginF = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  req$!: Observable<any>;
  errorname: any;
  getControl(name: string) {
    return this.loginF.get(name) as FormControl;
  }
  submit() {
    console.log('login Sign UPPP');
    if (this.loginF.valid) {
      this.http
        .post(`${environment.baseUrl}/login/`, this.loginF.value)
        .subscribe({
          next: (v: any) => {
            console.log(v.token);
            sessionStorage.setItem('token', v.token);
            this._Router.navigate(['/createTrip']);
            this._loginService.setLogin(true);
          },
          error: (err) => {
            this.errorname = err.error.error;
          },
        });
    }
  }
}
