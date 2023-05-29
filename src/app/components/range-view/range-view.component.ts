import { Component, Input, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-range-view',
  templateUrl: './range-view.component.html',
  styleUrls: ['./range-view.component.scss'],
})
export class RangeViewComponent  implements OnInit {
	@Input('type') type!: string;
  nationAvailable!: boolean;
	regionAvailable!: boolean;
	districtAvailable!: boolean;
	constituencyAvailable!: boolean;
	wardAvailable!: boolean;
	pollingCentreAvailable!: boolean;
  constructor(
    public dataService: CommonService, public navParams: NavParams,
    private popCtrl: PopoverController
  ) {
   }

  ngOnInit() {
    var year = this.dataService.getYear();
		var type = this.type;

		this.nationAvailable = false;
	    this.regionAvailable = false;
	    this.districtAvailable = false;
	    this.constituencyAvailable = false;
	    this.wardAvailable = false;
	    this.pollingCentreAvailable = false;

	    if (type == "villageheadman") {
	      this.pollingCentreAvailable = true;
	    }
	    else {
	      if (year != '2018') {
	        switch (type) {
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
	      else {
	        switch (type) {
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
  selectGranularity(granularity: string) {
		this.dataService.setGranularity(granularity);
    this.popCtrl.dismiss();
	}
}
