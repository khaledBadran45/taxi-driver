import { AfterViewInit, Component, inject } from '@angular/core';
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
  map!: L.Map;
  markers: L.Marker[] = [
    L.marker([30.72517, 31.6708449]), // Example marker
  ];
  _tripService = inject(TripService);

  ngAfterViewInit(): void {
    this.initMap(); // Ensure the map is initialized
    this.centerMap(); // Now, we can safely use this.map,
    this._tripService.tripPoints$.subscribe({
      next: (x: any) => {
        this.addRouts(x);
      },
      error: () => {},
    });
    // this.addRouts();
  }

  private initMap() {
    const baseMapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const mapElement = document.getElementById('map');

    if (!mapElement) {
      console.error('Map container not found!');
      return;
    }

    this.map = L.map(mapElement).setView([30.72517, 31.6708449], 12);
    L.tileLayer(baseMapURL, { maxZoom: 18 }).addTo(this.map);
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
}
