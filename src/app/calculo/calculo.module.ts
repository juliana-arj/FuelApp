import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculoPageRoutingModule } from './calculo-routing.module';

import { CalculoPage } from './calculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculoPageRoutingModule
  ],
  declarations: [CalculoPage]
})
export class CalculoPageModule {}
