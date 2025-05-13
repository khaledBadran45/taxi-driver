import {
  AfterViewInit,
  Component,
  effect,
  inject,
  output,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { pointLocation, tripPoints } from '../../create-trip/location.model';
import { TripService } from '../../create-trip/trip.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  locationsOnTheMap: any[] = [];
  map!: L.Map;
  markers: L.Marker[] = [
    L.marker([31.193861, 31.521063]), // Example marker
  ];
  _tripService = inject(TripService);
  detectLocations = output<{ lat: number; lon: number }[]>();
  ngAfterViewInit(): void {
    this.initMap(); // Ensure the map is initialized
    this.centerMap(); // Now, we can safely use this.map,
    this._tripService.tripPoints$.subscribe({
      next: (x: any) => {
        this.addRouts(x);
        console.log(x);
      },
      error: () => {},
    });
    this.getLocationByClick();
    // this.addRouts();
  }
  private initMap() {
    const baseMapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const mapElement = document.getElementById('map');

    if (!mapElement) {
      console.error('Map container not found!');
      return;
    }

    this.map = L.map(mapElement).setView([31.193861, 31.521063], 10);
    L.tileLayer(baseMapURL, { maxZoom: 15 }).addTo(this.map);
  }
  centerMap() {
    if (!this.map) {
      console.error('Map is not initialized!');
      return;
    }
    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );
    this.map.fitBounds(bounds);
  }
  addRouts(points: {
    entryPointLocation: pointLocation;
    exitPointLocation: pointLocation;
  }) {
    // Add routing without left menu
    L.Routing.control({
      waypoints: [
        L.latLng(points.entryPointLocation.lat, points.entryPointLocation.lon), // Start
        L.latLng(points.exitPointLocation.lat, points.exitPointLocation.lon), // End
      ],
      routeWhileDragging: true, // Enables dynamic route updates
      addWaypoints: false, // Disables the ability to add waypoints manually
      show: false, // Hides the left menu
      fitSelectedRoutes: true, // Adjust map zoom to fit the route
      collapsible: true, // Collapses any default UI
    }).addTo(this.map);
  }
  getLocationByClick() {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.locationsOnTheMap.length < 2) {
        this.locationsOnTheMap.push({ lat: lat, lon: lng });
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        console.log(e);

        // Optional: add marker at clicked location
        L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(`Lat: ${lat}<br>Lng: ${lng}`)
          .openPopup();

        if (this.locationsOnTheMap.length === 2) {
          this.addRouts({
            entryPointLocation: this.locationsOnTheMap[0],
            exitPointLocation: this.locationsOnTheMap[1],
          });

          this.detectLocations.emit(this.locationsOnTheMap);
        }
      } else {
        alert('You can only add two locations!');
      }
    });
  }
}
