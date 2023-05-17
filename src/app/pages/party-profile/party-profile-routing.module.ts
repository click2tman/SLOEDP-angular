import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartyProfilePage } from './party-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PartyProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartyProfilePageRoutingModule {}
