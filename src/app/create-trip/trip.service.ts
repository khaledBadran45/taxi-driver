import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { pointLocation, tripPoints } from './location.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private http: HttpClient) {}
  private tripPointsSubject = new BehaviorSubject<tripPoints | null>(null);
  tripPoints$: Observable<tripPoints | null> =
    this.tripPointsSubject.asObservable();
  setTripPoints(
    entryPointLocation: pointLocation,
    exitPointLocation: pointLocation
  ) {
    this.tripPointsSubject.next({
      entryPointLocation: entryPointLocation,
      exitPointLocation: exitPointLocation,
    });
  }

  searchCountry(countryName: string): Observable<any> {
    console.log(countryName);
    return this.http.get(
      `https://nominatim.openstreetmap.org/search?q=${countryName}&format=json`
    );
  }
  distanceAndDurationofCountries(
    entryPoint: pointLocation,
    existPoint: pointLocation
  ): Observable<any> {
    return this.http.get(
      `http://router.project-osrm.org/route/v1/driving/${entryPoint.lon},${entryPoint.lat};${existPoint.lon},${existPoint.lat}?overview=false`
    );
  }
  private apiKey = 'e399c20d-6a09-4794-bdd7-a8568f060871'; // Replace with your GraphHopper API Key
  private baseUrl = 'https://graphhopper.com/api/1/route';

  getDistanceAndTime(entryPoint: any, exitpoint: any): Observable<any> {
    const url = `${this.baseUrl}?point=${entryPoint.lat},${entryPoint.lon}&point=${exitpoint.lat},${exitpoint.lon}&vehicle=car&locale=en&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
