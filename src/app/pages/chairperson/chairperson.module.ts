import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChairpersonPageRoutingModule } from './chairperson-routing.module';

import { ChairpersonPage } from './chairperson.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChairpersonPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChairpersonPage]
})
export class ChairpersonPageModule {}
