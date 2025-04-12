import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DefaultValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TripService } from './trip.service';
import { Observable } from 'rxjs';
import { CommonModule, formatDate } from '@angular/common';
import { pointLocation } from './location.model';
import { KyloPipe } from '../pipes/kylo.pipe';
import { PopUPComponent } from '../low-level-comp/pop-up/pop-up.component';
import { MapComponent } from '../low-level-comp/map/map.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { InputControleComponent } from '../input-text/input-controle.component';
import { Router } from '@angular/router';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
// import { InputControleComponent } from '../input-text/input-controle.component';
@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    ButtonModule,
    AutoCompleteModule,
    FormsModule,
    CommonModule,
    MapComponent,
    CommonModule,
    InputControleComponent,
    ReactiveFormsModule,
    DropdownMenuComponent,
  ],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss',
})
export class CreateTripComponent {
  cost$!: Observable<any>;

  ngOnInit(): void {
    // this.taxisList$ = this.http.get(`${environment.baseUrl}/taxis/`, {
    //   headers: {
    //     'ngrok-skip-browser-warning': '69420',
    //   },
    // });
  }
  items!: Observable<any>;
  http = inject(HttpClient);
  _Router = inject(Router);
  mapVisibility = false;
  // distanceTime!: Observable<any>;
  _tripService = inject(TripService);
  entryPointLocation: pointLocation = { lat: 0, lon: 0 };
  exitPointLocation: pointLocation = { lat: 0, lon: 0 };
  taxisList$!: Observable<Object>;
  tripf = new FormGroup({
    starting_place: new FormControl(),
    ending_place: new FormControl(),
    taxi_id: new FormControl('', Validators.required),
    waiting_time: new FormControl<string>(''),
    // this method is expect a string and it's not working
    distance: new FormControl<string>(''),
  });
  costControl = new FormControl('');
  getControl(name: string) {
    return this.tripf.get(name) as FormControl<number>;
  }
  onClosePopUp() {
    this.mapVisibility = false;
  }
  selectEntryPoint(point: AutoCompleteSelectEvent) {
    this.entryPointLocation.lat = point.value.lat;
    this.entryPointLocation.lon = point.value.lon;
    this.tripf.get('starting_place')?.setValue(point.value.name);
    this.calculateDistanceDuration();
  }
  selectExistPoint(point: AutoCompleteSelectEvent) {
    this.exitPointLocation.lat = point.value.lat;
    this.exitPointLocation.lon = point.value.lon;
    this.tripf.get('ending_place')?.setValue(point.value.name);
    this.calculateDistanceDuration();
  }
  search(event: AutoCompleteCompleteEvent) {
    this.items = this._tripService.searchCountry(event.query);
  }
  calculateDistanceDuration() {
    if (this.entryPointLocation && this.exitPointLocation) {
      this._tripService
        .getDistanceAndTime(this.entryPointLocation, this.exitPointLocation)
        .subscribe({
          next: (val) => {
            const kilos = this.toKilo(val.paths[0].distance);
            this.tripf.get('distance')?.setValue(kilos);
            this.calcCost();
          },
          error: (error) => {
            if (error.status == 400) {
            }
          },
        });
      this._tripService.setTripPoints(
        this.entryPointLocation,
        this.exitPointLocation
      );
    }
  }
  calcCost() {
    this.http
      .post(
        `${environment.baseUrl}/calculate/`,
        {
          taxi_id: this.tripf.get('taxi_id')?.value,
          waiting_time: this.tripf.get('waiting_time')?.value,
          distance: this.tripf.get('distance')?.value,
        },
        {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        }
      )
      .subscribe((x: any) => this.costControl.setValue(`${x} P`));
  }
  toKilo(distanceMeteres: number): string {
    return (distanceMeteres / 1000).toFixed() + ' Km';
  }
  createTrip() {
    if (sessionStorage.getItem('token')) {
      this.http
        .post(`${environment.baseUrl}/journey/`, this.tripf.value, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        })
        .subscribe({
          next: (val) => {
            alert('you have successfully create a journy ');
          },
          error: (error) => {
            if (error.status == 401) {
              this._Router.navigate(['/login']);
            }
          },
        });
    } else {
      this._Router.navigate(['/login']);
    }
  }
  displayMap() {
    this.mapVisibility = true;
  }
}
