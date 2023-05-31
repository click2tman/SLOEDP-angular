import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChairpersonPage } from './chairperson.page';

const routes: Routes = [
  {
    path: '',
    component: ChairpersonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChairpersonPageRoutingModule {}
