import { Component } from '@angular/core';
import { CommonService } from './services/common.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  pages = [
    { title: 'SLOEDP Platform',name: "", url: '' },
    { title: 'Presidential',name: "presidential", url: '/president' },
    { title: 'Parliamentary',name: "parliamentary", url: '/parliamentary' },
    { title: 'Mayor',name: "mayor", url: 'mayor' },
    { title: 'Chairperson',name: "chairperson", url: 'chairperson' },
    { title: 'Councilor',name: "councilor", url: '' },
    { title: 'About this app',name: "about", url: '' },
  ];
  constructor(
    private commonService: CommonService
  ) {
    this.fatchJSON();
  }
  fatchJSON(){
    this.commonService.fathAllJSON();
  }
}
