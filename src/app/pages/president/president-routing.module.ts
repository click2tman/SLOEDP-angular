import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresidentPage } from './president.page';

const routes: Routes = [
  {
    path: '',
    component: PresidentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresidentPageRoutingModule {}
