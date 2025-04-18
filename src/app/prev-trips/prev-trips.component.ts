import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KyloPipe } from '../pipes/kylo.pipe';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-prev-trips',
  imports: [CommonModule, KyloPipe],
  templateUrl: './prev-trips.component.html',
  styleUrl: './prev-trips.component.scss',
})
export class PrevTripsComponent implements OnInit {
  _HttpClient = inject(HttpClient);
  _Router = inject(Router);
  _login = inject(LoginService);
  prevTrips: any[] = [];
  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this._login.setLogin(true);
      this._HttpClient
        .get(`${environment.baseUrl}/journey/`, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': '69420',
          },
        })
        .subscribe((x: any) => {
          this.prevTrips = x;
        });
    } else {
      this._Router.navigate([`/login`]);
    }
  }
}
