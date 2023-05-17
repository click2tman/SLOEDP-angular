import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapViewComponent } from '../map-view/map-view.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss'],
})
export class ContentViewComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MapViewComponent) mapView!: MapViewComponent;
  @ViewChild(TableViewComponent) tableView!: TableViewComponent;
  @Input('year') year: any;
  @Input('type') type: any;
  @Input('region') region: any;
  
  $Sub!: Subscription
  mapMode!: boolean;
  resultRegion!: string;
  results!: any;
  nationAvailable!: boolean;
  regionAvailable!: boolean;
  districtAvailable!: boolean;
  constituencyAvailable!: boolean;
  wardAvailable!: boolean;
  pollingCentreAvailable!: boolean;

  boundary!: string;
  mapDisabled!: boolean;
  sidebarDisabled!: boolean;
  constructor(
    private commonService: CommonService
  ) { 
    this.mapMode = true;
    this.$Sub = this.commonService.eventPublish().subscribe((response => {
      if(response.mode === 'boundary:select'){
        this.boundary = response.value;
      } else if(response.mode === 'mapMode'){
        this.mapMode = response.value;
      }
    }));
    this.sidebarDisabled = false
  }

  ngOnInit() {}
  ngAfterViewInit() {
    if (this.type != 'president')
      this.sidebarDisabled = true
  }
  setMapMode(mode: any) {
    this.mapMode = mode;
    this.mapDisabled = false;
    if (this.region == 'constituency' || this.region == 'ward' || this.region == 'polling_centre') this.mapDisabled = true;
    if (this.mapDisabled) this.mapMode = false

    if (this.mapMode == true && this.mapDisabled) return;
    this.commonService.eventSet(
      {
        mode: 'mapMode',
        value: this.mapMode
      }
    )
    if (this.mapMode) {
      setTimeout((...args: any[]) => {
        if (this.mapView)
          this.setMapInit();
      }, 10);
    }
    else {
      setTimeout((...args: any[]) => {
        if (this.tableView)
          this.setTableInit(this.boundary);
      }, 10);
    }
  }
  setMapInit() {
    if (this.mapView)
      this.mapView.drawMap();
  }
  setTableInit(boundary: any) {
    if (this.tableView)
      this.tableView.drawTable(boundary);
  }
  setResultRegion(region: string) {
    switch (region) {
      case "nation":
        this.resultRegion = "National Results";
        break;
      case "region":
        this.resultRegion = "Results By Region";
        break;
      case "district":
        this.resultRegion = "Results By District";
        break;
      case "constituency":
        this.resultRegion = "Results By Constituency";
        break;
      case "ward":
        this.resultRegion = "Result By Ward";
        break;
      case "polling_centre":
        this.resultRegion = "Result By Polling Centre";
        break;
      default:
        break;
    }
  }
  setGranularityList() {
    this.nationAvailable = false;
    this.regionAvailable = false;
    this.districtAvailable = false;
    this.constituencyAvailable = false;
    this.wardAvailable = false;
    this.pollingCentreAvailable = false;

    if (this.type == "villageheadman") {
      this.pollingCentreAvailable = true;
    }
    else {
      if (this.year != '2018') {
        switch (this.type) {
          case "president":
            this.nationAvailable = true;
            this.regionAvailable = true;
            this.districtAvailable = true;
            if (this.region != "nation" && this.region != "region" && this.region != "district")
              this.region = "nation";
            break;
          case "parliament":
            this.constituencyAvailable = true;
            if (this.region != "constituency")
              this.region = "constituency";
            break;
          case "mayor":
            this.districtAvailable = true;
            if (this.region != "district")
              this.region = "district"
            break;
          case "chairperson":
            this.districtAvailable = true;
            if (this.region != "district")
              this.region = "district"
            break;
          case "councilor":
            this.wardAvailable = true;
            if (this.region != "ward")
              this.region = "ward"
            break;
          default:
            // code...
            break;
        }
      }
      else {
        switch (this.type) {
          case "president":
            this.nationAvailable = true;
            this.regionAvailable = true;
            this.districtAvailable = true;
            break;
          case "parliament":
            this.constituencyAvailable = true;
            break;
          case "mayor":
            this.districtAvailable = true;
            break;
          case "chairperson":
            this.districtAvailable = true;
            break;
          case "councilor":
            this.wardAvailable = true;
            break;
          default:
            // code...
            break;
        }
      }
    }
  }
  ngOnDestroy(): void {
      if(this.$Sub){
        this.$Sub.unsubscribe;
      }
  }
}
