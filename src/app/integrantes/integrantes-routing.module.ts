import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntegrantesPage } from './integrantes.page';

const routes: Routes = [
  {
    path: '',
    component: IntegrantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrantesPageRoutingModule {}
