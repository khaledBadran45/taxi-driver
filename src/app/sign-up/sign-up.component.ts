import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputControleComponent } from '../input-text/input-controle.component';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [InputControleComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  errorname: string = '';
  http = inject(HttpClient);
  _Router = inject(Router);
  _login = inject(LoginService);
  signUpForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  submit() {
    if (this.signUpForm.valid) {
      this.http
        .post(`${environment.baseUrl}/register/`, this.signUpForm.value)
        .subscribe({
          next: (v: any) => {
            console.log(v);
            sessionStorage.setItem('token', v.token);
            this._login.setLogin(true);
            this._Router.navigate(['/createTrip']);
            this;
          },
          error: (err) => {
            this.errorname = err.error.username[0];
          },
        });
    } else {
      console.log('not valid');
    }
  }
  getControl(name: string) {
    return this.signUpForm.get(name) as FormControl;
  }
}
