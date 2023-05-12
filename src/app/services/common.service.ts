import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  nationGeoJSON
  regionGeoJSON
  region2018GeoJSON
  districtGeoJSON
  district2018GeoJSON
  constructor(
    private http: HttpClient
  ) { }

}
