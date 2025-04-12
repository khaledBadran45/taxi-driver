import { Component } from '@angular/core';
import { CreateTripComponent } from "./create-trip/create-trip.component";
import { NavComponent } from "./nav/nav.component";
import { RouterOutlet } from '@angular/router';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NavComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'distanceCostCalculator';
  /***
   * - create a trip
   * user going to Enter two locations => (entry point) && (exist point) .
   *
   * get the longitud , latitude for every location .
   *
   *
   */
}
