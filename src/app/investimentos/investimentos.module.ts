import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestimentosPageRoutingModule } from './investimentos-routing.module';

import { InvestimentosPage } from './investimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestimentosPageRoutingModule
  ],
  declarations: [InvestimentosPage]
})
export class InvestimentosPageModule {}
