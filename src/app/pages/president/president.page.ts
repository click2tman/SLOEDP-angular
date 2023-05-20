import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ContentViewComponent } from 'src/app/components/content-view/content-view.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-president',
  templateUrl: './president.page.html',
  styleUrls: ['./president.page.scss'],
})
export class PresidentPage implements OnInit {
  @ViewChild(IonSlides) slides!: IonSlides;
  @ViewChildren(ContentViewComponent) subPageViews: any;
  subpages!: Array<{year: Number}>;
  totalPages!: any;
  year!: Number;
  prevYear!: Number;
  nextYear!: Number;
  prevEnabled!:	Boolean;
  nextEnabled!:	Boolean;
  region = "nation";
  initialSlide: any;
  
  subscription!: Subscription;
  constructor(
    private commonService: CommonService
  ) {
    this.prevEnabled = false;
    this.nextEnabled = false;
    this.year = 0;
    this.prevYear = 0;
    this.nextYear = 0;

    this.subpages = [
      { year: 1996},
      { year: 2002},
      { year: 2007},
      { year: 2012},
      { year: 2018},
    ];
    this.initialSlide = this.subpages.length > 1 ? this.subpages.length - 1 : 0;
    this.setPageInfo();
   }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.subscription = this.commonService.getGranularity().subscribe(granularity => { 
      this.region = granularity;
      this.setSlideChanges();
    });
  }
  setPageInfo() {
    this.totalPages = this.subpages.length;
    if (this.totalPages > 0) {
      this.year = this.subpages[0].year;
    }

    if (this.totalPages > 1) {
      this.nextEnabled = true;
      this.nextYear = this.subpages[1].year;
    }
  }
  setPrevPage() {
    let index: any = this.slides.getActiveIndex();
  	this.slides.slideTo(index - 1, 500);
  }

  setNextPage() {
    let index: any = this.slides.getActiveIndex();
  	this.slides.slideTo(index + 1, 500);
  }
  async slideChanged() {
  	let currentIndex = await this.slides.getActiveIndex();
  	if (!this.totalPages || currentIndex == this.totalPages || this.totalPages == 0) return;

  	this.prevEnabled = !this.slides.isBeginning();
  	this.nextEnabled = !this.slides.isEnd();

  	this.year = this.subpages[currentIndex].year;
  	this.prevYear = this.prevEnabled ? this.subpages[currentIndex - 1].year : 0;
  	this.nextYear = this.nextEnabled ? this.subpages[currentIndex + 1].year : 0;

    this.setSlideChanges();
  }
  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }
  async setSlideChanges() {
    let currentIndex = await this.slides.getActiveIndex();
    if (!this.totalPages || currentIndex == this.totalPages || this.totalPages == 0) return;

    this.subPageViews._results[currentIndex].setContentView();
    this.commonService.setYear(this.year);
  }
}
