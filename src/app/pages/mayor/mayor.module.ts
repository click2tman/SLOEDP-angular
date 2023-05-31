import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorPageRoutingModule } from './mayor-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { MayorPage } from './mayor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MayorPage]
})
export class MayorPageModule {}
