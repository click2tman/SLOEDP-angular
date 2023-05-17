import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartyProfilePageRoutingModule } from './party-profile-routing.module';

import { PartyProfilePage } from './party-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartyProfilePageRoutingModule
  ],
  declarations: [PartyProfilePage]
})
export class PartyProfilePageModule {}
