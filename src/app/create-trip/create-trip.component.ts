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
import { Router } from '@angular/router';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { LoginService } from '../login.service';
import { AlertComponent } from '../alert/alert.component';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';
// import { InputControleComponent } from '../input-text/input-controle.component';
@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    ButtonModule,
    AutoCompleteModule,
    FormsModule,
    MapComponent,
    CommonModule,
    ReactiveFormsModule,
    DropdownMenuComponent,
    PopUPComponent,
    AlertComponent,
  ],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.scss',
})
export class CreateTripComponent implements AfterViewInit {
  @ViewChild(AlertComponent) alert!: AlertComponent;
  @ViewChild(MapComponent) MapComponent!: MapComponent;
  showJourneyCostAlert(message: string, type: AlertType, time: number) {
    this.alert.showAlert(
      message,
      type,
      true,
      time // 0 means don't auto-close
    );
  }
  ngAfterViewInit() {
    this.showJourneyCostAlert(
      `the cost of your journy is ${100}`,
      'info',
      6000
    );
  }
  nearpyTaxis: {
    taxi_id: number;
    taxi_type: string;
    taxi_location: string;
    distance_km: number;
    duration_min: number;
  }[] = [];
  onClosePopUp() {
    this.mapVisibility = false;
  }
  cost$!: Observable<any>;
  distanceInMeters: any;
  journyDetails!: {};
  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this._login.setLogin(true);
      this.taxisList$ = this.http.get(`${environment.baseUrl}/taxis/`, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
    } else {
      this._Router.navigate(['/login']);
    }
  }
  getTaxiIcon(icon: string) {
    return 'Icon';
  }
  items!: Observable<any>;
  http = inject(HttpClient);
  _login = inject(LoginService);
  _Router = inject(Router);
  mapVisibility = false;
  // distanceTime!: Observable<any>;
  _tripService = inject(TripService);
  entryPointLocation: pointLocation = { lat: 0, lon: 0 };
  exitPointLocation: pointLocation = { lat: 0, lon: 0 };
  taxisList$!: Observable<Object>;
  tripf = new FormGroup({
    taxi_id: new FormControl('', Validators.required),
    starting_place: new FormControl(),
    ending_place: new FormControl(),
    distance: new FormControl<number>(0),
    waiting_time: new FormControl<number>(0),
    num_customers: new FormControl<number>(0, Validators.required),
    // this method is expect a string and it's not working
  });
  costControl = new FormControl('');
  selectEntryPoint(point: AutoCompleteSelectEvent) {
    this.entryPointLocation.lat = point.value.lat;
    this.entryPointLocation.lon = point.value.lon;
    this.tripf.get('starting_place')?.setValue(point.value.name);
    // console.log(point.value.name);
    // this.calculateDistanceDuration();
  }
  selectExistPoint(point: AutoCompleteSelectEvent) {
    this.exitPointLocation.lat = point.value.lat;
    this.exitPointLocation.lon = point.value.lon;
    this.tripf.get('ending_place')?.setValue(point.value.name);
    this.calculateDistanceDuration([
      this.entryPointLocation,
      this.exitPointLocation,
    ]);
    this.MapComponent.addRouts({
      entryPointLocation: this.entryPointLocation,
      exitPointLocation: this.exitPointLocation,
    });
  }
  getControl(name: string) {
    return this.tripf.get(name) as FormControl<number>;
  }
  search(event: AutoCompleteCompleteEvent) {
    this.items = this._tripService.searchCountry(event.query);
  }
  calculateDistanceDuration(locations: any) {
    this._tripService.getDistanceAndTime(locations[0], locations[1]).subscribe({
      next: (val) => {
        this.distanceInMeters = val.paths[0].distance;
        const kilos = this.toKilo(val.paths[0].distance);
        this.tripf.get('distance')?.setValue(parseInt(kilos));
      },
      error: (error) => {
        if (error.status == 400) {
          alert(`Error bad request`);
        }
      },
    });
    this._tripService.setTripPoints(
      this.entryPointLocation,
      this.exitPointLocation
    );
  }
  calcCost(duration: number) {
    console.log(this.tripf.get('taxi_id')?.value);
    if (this.tripf.valid) {
      const taxiId = this.tripf.get('taxi_id')?.value;
      // const waitingTime = this.tripf.get('waiting_time')?.value;
      const distance = this.tripf.get('distance')?.value;
      if (taxiId && distance) {
        this.journyDetails = {
          taxi_id: parseInt(taxiId),
          waiting_time: duration,
          distance: this.distanceInMeters,
        };
      }
      let journyCost = '';
      this.http
        .post(`${environment.baseUrl}/calculate/`, this.journyDetails, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        })
        .subscribe((x: any) => {
          journyCost = `${x.cost} P`;
          this.alert.message = `the cost of your journy is ${journyCost}`;
          this.alert.show = true;
          this.createTrip(duration);
        });
    } else {
      alert(`data invalid`);
    }
  }
  toKilo(distanceMeteres: number): string {
    return (distanceMeteres / 1000).toFixed() + ' Km';
    15;
  }
  createTrip(wt: any) {
    this.tripf.get('distance')?.setValue(this.distanceInMeters);
    this.tripf.get('waiting_time')?.setValue(wt);
    if (sessionStorage.getItem('token')) {
      this.http
        .post(`${environment.baseUrl}/journey/`, this.tripf.value, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        })
        .subscribe({
          next: (val) => {
            setTimeout(() => {
              this.alert.message = `you have successfully create a journy`;
              this.alert.type = 'success';
            }, 2000);
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
  onDetectLocations(locations: any) {
    // here we can start
    // calc

    this.entryPointLocation = locations[0];
    this.exitPointLocation = locations[1];
    this.calculateDistanceDuration(locations);
    this.getCountriesName(
      this.entryPointLocation.lat,
      this.entryPointLocation.lon,
      'starting_place'
    );

    this.getCountriesName(
      this.exitPointLocation.lat,
      this.exitPointLocation.lon,
      'ending_place'
    );
  }
  getCountriesName(lat: number, lon: number, controlName: string) {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    )
      .then((res) => res.json())
      .then((data) => {
        const country = data?.display_name || 'Unknown';
        console.log(country, this.tripf.get(controlName));
        this.tripf.get(controlName)?.setValue(country);
        console.log(this.tripf.value);
      })
      .catch((err) => console.error('Reverse geocoding error:', err));
  }
  exploreNearpyTaxis() {
    if (this.tripf.valid) {
      console.log(this.tripf.value);
      this.mapVisibility = true;
      const userLocation = {
        latitude: Number(this.entryPointLocation.lat),
        longitude: Number(this.entryPointLocation.lon),
        type: this.tripf.get('taxi_id')?.value,
      };
      this.http
        .post(`${environment.baseUrl}/avilable-taxis/`, userLocation, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        })
        .subscribe({  
          next: (val: any) => {
            this.mapVisibility = true;
            this.nearpyTaxis = val;
            console.log(this.nearpyTaxis);
          },
          error: (error) => {
            if (error.status == 401) {
              this._Router.navigate(['/login']);
            }
          },
        });
    } else {
      alert('please enter a valid data');
    }
  }
  getTaxiCost() {}
}
