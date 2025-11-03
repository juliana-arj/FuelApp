import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculoPage } from './calculo.page';

const routes: Routes = [
  {
    path: '',
    component: CalculoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculoPageRoutingModule {}
