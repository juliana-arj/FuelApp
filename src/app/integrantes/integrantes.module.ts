import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntegrantesPageRoutingModule } from './integrantes-routing.module';

import { IntegrantesPage } from './integrantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntegrantesPageRoutingModule
  ],
  declarations: [IntegrantesPage]
})
export class IntegrantesPageModule {}
