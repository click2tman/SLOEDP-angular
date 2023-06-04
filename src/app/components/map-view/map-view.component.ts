import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { icon, latLng, Layer, marker, geoJSON, tileLayer } from "leaflet";
import * as Leaflet from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.awesome-markers';

let nationGeoJSON: any;
let regionGeoJSON: any;
let region2018GeoJSON: any;
let districtGeoJSON: any;
let district2018GeoJSON: any;




import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent  implements OnInit, AfterViewInit {
  @Input("year") year!: any;
  @Input("region") region!: any;
  @Input("type") type!: any;
  round!: boolean;
  map!: Leaflet.Map;
  result: any;
  boundary_json: any;

  noWinner!: boolean;
  isRoundAvailable!: boolean;

  // Map Init
  mapOptions = {
    zoom: 7,
    center: latLng(8.460555, -11.779889),
  };

  layers!: Layer[];
  two_rounds = [1996, 2007, 2018];
  constructor(
    private router: Router,
    private commonService: CommonService,
    private ref: ChangeDetectorRef
  ) { 
    this.fetchData();
    this.result = {
      ResultStatus: "",
      TotalVotes: "",
      ValidVotes: "",
      InvalidVotes: "",
      VotesPecentage: "",
      Parties: {},
      Candidates: {},
      Boundaries: [],
      ElectionResults: [],
    };
    this.noWinner = true;
  }
  fetchData(){
    nationGeoJSON = this.commonService.nationGeoJSON;
    regionGeoJSON = this.commonService.regionGeoJSON;
    region2018GeoJSON = this.commonService.region2018GeoJSON;
    districtGeoJSON = this.commonService.districtGeoJSON;
    district2018GeoJSON = this.commonService.district2018GeoJSON;
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // this.applyMap([]);
    this.isRoundAvailable =
      this.type == "president" && this.two_rounds.indexOf(this.year) != -1;
    this.round = this.year == 2018;
  }
  gotoPage(path: string, id: any){
    this.router.navigate([`${path}/${id}`]);
  }
  candidatesEnable() {
    return this.result.ElectionResults.length > 0;
  }
  transform2d(value: [], columns: any, limit: any): any {
    let results = [];
    for (let i in value) {
      if (i >= limit) continue;
      if (Number(i) % columns == 0) {
        results.push([value[i]]);
      } else {
        results[results.length - 1].push(value[i]);
      }
    }

    return results;
  }

  setPhotoUrl(photo: string) {
    return "assets/imgs/candidate/" + photo;
  }
  colorFilter(_color: string) {
    var default_color = "#999";
    var colors = ["Pink", "Orange", "Green", "Red", "Blue", "Purple", "Yellow"];
    var color = _color.trim();
    if (!color) return default_color;
    if (color.split(",").length > 1) {
      return color.split(",")[0];
    }
    if (colors.indexOf(color.charAt(0).toUpperCase() + color.slice(1)) > -1) {
      return color;
    }
    return "#" + color;
  }

  makeKey(value: string) {
    return value.toLowerCase().replace(/\ /gi, "_");
  }


  makeBoundaryJson(boundaries: any[]) {
    var boundary_key;
    var boundary_json: any = {};
    var vm = this;
    boundaries.forEach(function (boundary) {
      boundary_key = vm.makeKey(boundary.name);
      boundary_json[boundary_key] = boundary;
    });

    return boundary_json;
  }

  otherPercent(candidates: any) {
    return (
      100.0 -
      parseFloat(candidates[0].ValidVotesPercentage) -
      parseFloat(candidates[1].ValidVotesPercentage)
    ).toFixed(2);
  }

  getBoundaryColor(boundary: any) {
    var boundary_key = this.makeKey(boundary.name);
    return this.colorFilter(
      this.boundary_json[boundary_key].candidates[0]
        .CandidatePoliticalPartyColor
    );
  }

  changeRound(round: any) {
    this.drawMap();
  }
  drawMap() {
    console.log('drawMap()');
    if(this.map){
      // this.map.off();
      this.map.remove();
      this.map.invalidateSize();
    }
    this.map = Leaflet.map('mapId'+this.year).setView([8.460555, -11.779889], 7);
    this.map.off();
    var fields: any = {
      year: this.year,
      type: this.type,
      region: this.region,
    };
    if (this.type == "president" && this.two_rounds.indexOf(this.year) != -1)
      fields["round"] = this.round ? "second" : "first";

    var vm = this;

    this.commonService.showLoading('Loading data...');
    // Create the popup

    try {
      this.commonService.loadResultsByFields(fields).then((data: any) => {
        var Parties = data["Parties"];
        vm.result.Candidates = data["Candidates"];
        vm.result.Boundaries = data["Boundaries"];
        vm.result.TotalVotes = this.year == "2018" ? 3178664 : data["ValidVotes"];
  
        vm.result.InvalidVotes = this.year == "2018" ? 139427 : 0;
        vm.result.ResultStatus = "Final & Certified";
  
        vm.result.ElectionResults = [];
        vm.boundary_json = {};
        if (vm.result.Boundaries.length > 0) {
          vm.boundary_json = vm.makeBoundaryJson(vm.result.Boundaries);
          if (vm.result.Boundaries[0].candidates[0]["ValidVotes"] > 0) {
            vm.noWinner = false;
            vm.result.ValidVotes = vm.result.Boundaries[0].votes;
            if (vm.year == "2018")
              if (vm.result.TotalVotes == 0) vm.result.VotesPecentage = "0%";
              else
                vm.result.VotesPecentage =
                  ((vm.result.ValidVotes / vm.result.TotalVotes) * 100).toFixed(
                    2
                  ) + "%";
            else vm.result.VotesPecentage = "100%";
          } else {
            vm.noWinner = true;
          }
  
          vm.result.ElectionResults = vm.result.Boundaries[0].candidates;
          vm.commonService.eventSet({mode:"boundary:select", value: vm.result.Boundaries[0].name})
          // vm.events.publish("boundary:select", vm.result.Boundaries[0].name);
          vm.result.Parties = {};
  
          for (let candidate of vm.result.Boundaries[0].candidates) {
            vm.result.Parties[candidate["CandidatePoliticalParty"]] =
              Parties[candidate["CandidatePoliticalParty"]];
          }
        }
  
        if (
          vm.region == "nation" ||
          vm.region == "region" ||
          vm.region == "district"
        ) {
          var geoData: any;
          if (vm.region == "nation") geoData = nationGeoJSON["features"];
          if (vm.region == "region" && vm.year != "2018")
            geoData = regionGeoJSON["features"];
          if (vm.region == "region" && vm.year == "2018")
            geoData = region2018GeoJSON["features"];
          if (vm.region == "district" && vm.year != "2018")
            geoData = districtGeoJSON["features"];
          if (vm.region == "district" && vm.year == "2018")
            geoData = district2018GeoJSON["features"];
  
          Leaflet.geoJSON(geoData, {
            onEachFeature: (feature: any, layer) => {
              var boundary_key = vm.makeKey(feature.properties.Name);
              var boundaryName = feature.properties.Name;
              if (vm.type == "mayor" && vm.boundary_json[boundary_key])
                boundaryName = vm.boundary_json[boundary_key]["name_council"];
              layer.bindPopup(boundaryName);
  
              layer.on("click", function () {
                var boundary_key = vm.makeKey(feature.properties.Name);
                var boundary = vm.boundary_json[boundary_key];
                vm.applyResult(boundary);
              });
              if (vm.region == "region" && feature.properties.Name == "West") {
                layer.fireEvent("click");
                setTimeout(function () {
                  layer.openPopup();
                }, 10);
              }
              if (
                vm.region == "district" &&
                feature.properties.Name == "Western Area Urban"
              ) {
                layer.fireEvent("click");
                setTimeout(function () {
                  layer.openPopup();
                }, 10);
              }
            },
            style: (feature: any) => {
              var boundary_key = vm.makeKey(feature.properties.Name);
              if (vm.boundary_json[boundary_key])
                return {
                  color: vm.colorFilter(
                    vm.boundary_json[boundary_key].candidates[0]
                      .CandidatePoliticalPartyColor
                  ),
                };
              else return { color: "#999" };
            },
          }).addTo(this.map);
          Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'edupala.com © Angular LeafLet',
          }).addTo(this.map);
          // vm.applyMap([geoJSONLayer],this.map);
        } else {
          var markerBoundary;
          var layers = [];
          for (let boundary of vm.result.Boundaries) {
            markerBoundary = marker([boundary.latitude, boundary.longitude], {
              icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: "../../assets/imgs/marker.png",
                shadowUrl: "../../assets/imgs/marker-shadow.png",
              }),
            })
              .bindPopup(boundary.name)
              .on("click", () => {
                vm.applyResult(boundary);
              });
            layers.push(markerBoundary);
          }
          vm.applyMap(layers, this.map);


          // const boundaries = vm.result.Boundaries; // Assuming you have the boundaries array available

          // const markerIcon = Leaflet.icon({
          //   iconUrl: '../../assets/imgs/marker.png',
          //   iconSize: [25, 41],
          //   iconAnchor: [13, 41],
          //   popupAnchor: [0, -28],
          // });

          // const markerClusterGroup = Leaflet.markerClusterGroup();

          // for (let boundary of boundaries) {
          //   const marker = Leaflet.marker([boundary.latitude, boundary.longitude], { icon: markerIcon })
          //     .bindPopup(boundary.name)
          //     .on('click', () => {
          //       vm.applyResult(boundary);
          //     });
          //   markerClusterGroup.addLayer(marker);
          // }
          // markerClusterGroup.addTo(this.map);
          // Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          //   attribution: 'edupala.com © Angular LeafLet',
          // }).addTo(this.map);
        }
        // console.log(this.result.Parties);
        vm.commonService.hideLoading();
        vm.commonService.hideLoadingTime();
      }).catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }
  applyResult(boundary: any) {
    if (boundary) {
      this.result.ElectionResults = boundary.candidates;
      this.result.ValidVotes = boundary.votes;
      if (this.year == "2018")
        if (this.result.TotalVotes == 0) this.result.VotesPecentage = "0%";
        else {
          this.result.VotesPecentage =
            ((this.result.ValidVotes / this.result.TotalVotes) * 100).toFixed(
              2
            ) + "%";
        }
      else this.result.VotesPecentage = "100%";
      if (boundary.votes > 0) this.noWinner = false;
      else this.noWinner = true;
      this.commonService.eventSet(
        {
          mode: 'boundary:select',
          value: 'boundary.name'
        }
      )
    } else {
      this.result.ElectionResults = [];
      this.result.ValidVotes = 0;
      this.result.VotesPecentage = 0;
      this.noWinner = true;
    }
    this.ref.detectChanges();
  }
  applyMap(layers: any, map: Leaflet.Map) {
    
    layers.push(
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "Open Street Map",
      }).addTo(map),
    );
    this.layers = layers;
    return false;
  }
}
