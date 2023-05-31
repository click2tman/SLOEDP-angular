import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
// import { antPath } from 'leaflet-ant-path';
@Component({
  selector: 'app-parliamentary',
  templateUrl: './parliamentary.page.html',
  styleUrls: ['./parliamentary.page.scss'],
})
export class ParliamentaryPage implements OnInit, OnDestroy {

  map!: Leaflet.Map;

  constructor() { }

  ngOnInit() { }
  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    this.map = Leaflet.map('mapId').setView([8.460555, -11.779889], 7);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);

    Leaflet.marker([28.6, 77]).addTo(this.map).bindPopup('Delhi').openPopup();
    Leaflet.marker([34, 77]).addTo(this.map).bindPopup('Leh').openPopup();

    // antPath([[28.644800, 77.216721], [34.1526, 77.5771]],
    //   { color: '#FF0000', weight: 5, opacity: 0.6 })
    //   .addTo(this.map);
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

}
