import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { ModelEthComponent } from 'src/app/components/model-eth/model-eth.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    ModelEthComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule
  ]
})
export class LandingPageModule { }
