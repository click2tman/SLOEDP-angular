import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParliamentaryPageRoutingModule } from './parliamentary-routing.module';

import { ParliamentaryPage } from './parliamentary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParliamentaryPageRoutingModule
  ],
  declarations: [ParliamentaryPage]
})
export class ParliamentaryPageModule {}
