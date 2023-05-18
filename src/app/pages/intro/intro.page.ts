import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides,{static: true}) slides!: IonSlides;
  back = 'Skip';
  next = 'Next';
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(
    private commonService: CommonService
  ) {}

  ngOnInit() {}

  async onSkip() {
    var current_index = await this.slides.getActiveIndex();
    if (current_index == 0) this.commonService.root('president');
    else this.slides.slideTo(current_index - 1, 500)
  }
  async onStart() {
    var current_index = await this.slides.getActiveIndex()
    if (current_index == 2)
      this.commonService.root('president');
    else
      this.slides.slideTo(current_index + 1, 500)
  }
  async slideChanged() {
    var current_index = await this.slides.getActiveIndex()
    switch (current_index) {
      case 0:
        // code...
        this.back = "Skip"
        this.next = "Next"
        break;
      case 1:
        this.back = "Back"
        this.next = "Next"
        // code...
        break;
      case 2:
        this.back = "Back"
        this.next = "Start App"
        // code...
        break;
    }
  }
}
