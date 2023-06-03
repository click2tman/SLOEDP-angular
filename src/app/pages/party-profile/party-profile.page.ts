import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-party-profile',
  templateUrl: './party-profile.page.html',
  styleUrls: ['./party-profile.page.scss'],
})
export class PartyProfilePage implements OnInit {
  public party: any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute
  ) { 
    const id = this.route.snapshot.params['id'];
    console.log(id);
    this.party = commonService.getParty(id)
  }

  ngOnInit() {
  }
  sourceUrl(url: string) {
		return "assets/imgs/party/" + url;
	}
  back(){
    this.commonService.back();
  }
	colorFilter(color: any) {
		var default_color = "#999";
		var colors = ["Pink", "Orange", "Green", "Red", "Blue", "Purple", "Yellow"];
		if (!color) return default_color;
		if (color.split(', ').length > 1) {
			return color.split(', ')[0];
		}
		if (colors.indexOf(color.charAt(0).toUpperCase() + color.slice(1)) > -1) {
			return color;
		}
		return "#" + color;
	}
  openSite(url: string){
    if(!url) return;
    this.openSite(url);
  }
}
