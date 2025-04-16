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
  distanceInMeters: any;
  journyDetails!: {};

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this.taxisList$ = this.http.get(`${environment.baseUrl}/taxis/`, {
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      });
    } else {
      this._Router.navigate(['/login']);
    }
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
            this.distanceInMeters = val.paths[0].distance;
            const kilos = this.toKilo(val.paths[0].distance);
            this.tripf.get('distance')?.setValue(kilos);
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
  }
  calcCost() {
    if (this.tripf.valid) {
      const taxiId = this.tripf.get('taxi_id')?.value;
      const waitingTime = this.tripf.get('waiting_time')?.value;
      const distance = this.tripf.get('distance')?.value;
      if (taxiId && waitingTime && distance) {
        this.journyDetails = {
          taxi_id: parseInt(taxiId),
          waiting_time: parseInt(waitingTime),
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
          const isSureAndContinue = confirm(
            `the cost of your journy is ${journyCost} are you sure you want to continue?`
          );
          if (isSureAndContinue) {
            this.createTrip();
          }
        });
    } else {
      alert(`data invalid`);
    }
  }
  toKilo(distanceMeteres: number): string {
    return (distanceMeteres / 1000).toFixed() + ' Km';
    15;
  }
  createTrip() {
    this.tripf.get('distance')?.setValue(this.distanceInMeters);
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
