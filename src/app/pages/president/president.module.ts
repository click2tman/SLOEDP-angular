import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresidentPageRoutingModule } from './president-routing.module';

import { PresidentPage } from './president.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresidentPageRoutingModule, 
    ComponentsModule
  ],
  declarations: [PresidentPage]
})
export class PresidentPageModule {}
