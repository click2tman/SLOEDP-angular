import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouncilorPage } from './councilor.page';

const routes: Routes = [
  {
    path: '',
    component: CouncilorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouncilorPageRoutingModule {}
