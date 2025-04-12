import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CreateTripComponent } from './create-trip/create-trip.component';
import { PrevTripsComponent } from './prev-trips/prev-trips.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'createTrip', component: CreateTripComponent },
  { path: 'prevTrips', component: PrevTripsComponent },
  // { path: 'prevTrips', component: PrevTripsComponent },
];
