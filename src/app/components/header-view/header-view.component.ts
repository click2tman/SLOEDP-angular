import { Component, OnInit,Input } from '@angular/core';
import { PopoverController }from '@ionic/angular';
import { RangeViewComponent } from '../range-view/range-view.component';
@Component({
  selector: 'app-header-view',
  templateUrl: './header-view.component.html',
  styleUrls: ['./header-view.component.scss'],
})
export class HeaderViewComponent  implements OnInit {
  
  isGranularityEnabled!: boolean;

  @Input('type') type!: string;

  constructor(public popoverCtrl: PopoverController) { }

  ngOnInit() {}

  async selectRange(event: any) {
  	let popover = await this.popoverCtrl.create({component: RangeViewComponent, componentProps: {type: this.type}});
    popover.present();
  }
}
