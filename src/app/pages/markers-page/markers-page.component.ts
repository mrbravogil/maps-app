import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { v4 as UUIDV4 } from 'uuid';
import { environment } from '../../../environments/environment.development';
mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit { 

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map|null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit(){
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80)); // wait for the view to be initialized

    const element = this.divElement()!.nativeElement;
    

      const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-122.400219, 37.796083], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    // const marker = new mapboxgl.Marker({
    //   draggable: false, // make the marker draggable
    //   color: 'black',
    // })
    //   .setLngLat([-122.400219, 37.796083]) // set marker position
    //   .addTo(map); // add marker to the map

    // marker.on('dragend', (event) => {
    //   console.log(event);
    // });

    this.mapListeners(map);
    
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {

  if (!this.map()) return;

  const map = this.map()!;    
  const coords = event.lngLat;
  const color = '#xxxxxx'.replace(/x/g, (y) =>
    ((Math.random() * 16) | 0).toString(16)
  );

  const mapboxMarker = new mapboxgl.Marker({
      color: color,
    })
      .setLngLat(coords) // set marker position
      .addTo(map); // add marker to the map
  
  const newMarker: Marker = {
    id: UUIDV4(),
    mapboxMarker: mapboxMarker
  }
  // this.markers.set([newMarker, ...this.markers()]);
  this.markers.update((markers) => [newMarker, ...markers]);

  console.log(this.markers())
  }

  flyToMarker (lngLat: LngLatLike){
    if (!this.map()) return;
    
    this.map()!.flyTo({
      center: lngLat,
    });
  }

  deleteMarker (marker: Marker) {
    if (!this.map()) return;
    const map = this.map()!;

    marker.mapboxMarker.remove(); // remove marker from the map
    this.markers.set (this.markers().filter(m => m.id !== marker.id)); // remove marker from the markers array

  }

}
