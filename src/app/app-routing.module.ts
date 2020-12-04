import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryComponent } from './pages/country/country.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/country',
    pathMatch: 'full'
  },
  {
    path: 'country',
    component: CountryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
