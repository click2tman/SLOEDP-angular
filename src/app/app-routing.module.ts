import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'president',
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./pages/intro/intro.module').then((m) => m.IntroPageModule),
  },
  {
    path: 'president',
    loadChildren: () => import('./pages/president/president.module').then( m => m.PresidentPageModule)
  },
  {
    path: 'candidate/:id',
    loadChildren: () => import('./pages/candidate/candidate.module').then( m => m.CandidatePageModule)
  },
  {
    path: 'party/:id',
    loadChildren: () => import('./pages/party-profile/party-profile.module').then( m => m.PartyProfilePageModule)
  },
  {
    path: 'parliamentary',
    loadChildren: () => import('./pages/parliamentary/parliamentary.module').then( m => m.ParliamentaryPageModule)
  },
  {
    path: 'mayor',
    loadChildren: () => import('./pages/mayor/mayor.module').then( m => m.MayorPageModule)
  },
  {
    path: 'chairperson',
    loadChildren: () => import('./pages/chairperson/chairperson.module').then( m => m.ChairpersonPageModule)
  },
  {
    path: 'councilor',
    loadChildren: () => import('./pages/councilor/councilor.module').then( m => m.CouncilorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
