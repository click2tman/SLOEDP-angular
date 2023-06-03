import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.page.html',
  styleUrls: ['./candidate.page.scss'],
})
export class CandidatePage implements OnInit {
	public candidate: any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute
  ) { 
    const id = this.route.snapshot.params['id'];
    this.candidate = commonService.getCandidate(id)
  }

  ngOnInit() {
  }
  back(){
    this.commonService.back();
  }

	sourceUrl(url: string) {
		return "assets/imgs/candidate/" + url;
	}

	getCandidateName() {
		return this.candidate.Prefix + " " + this.candidate.FirstName + " " + this.candidate.MiddleName + " " + this.candidate.SurName;
	}
}
