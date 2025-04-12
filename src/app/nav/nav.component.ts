import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  // isLogin: boolean = this.login.getValue();
  _loginService = inject(LoginService);
  
  _Router = inject(Router);
  token = true
  isLogin: boolean = false;
  ngOnInit(): void {
    this._loginService.loginS
      .pipe(
        map((data) => {
          this.isLogin = data;
          console.log(this.isLogin);
        })
      )
      .subscribe();
    /**
       * if (this.token) {`
      this._loginService.setLogin(true);
      this._Router.navigate(['/createTrip'])
    } else {
      this._loginService.setLogin(false);
    }
       */
  }
  http = inject(HttpClient);
  logOut() {
    this.http
      .post(
        `${environment.baseUrl}/logout/`,
        {},
        {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }
      )
      .pipe(map((data) => {}))
      .subscribe((res) => {
        console.log(res);
        this._loginService.setLogin(false);
      });
  }
}
