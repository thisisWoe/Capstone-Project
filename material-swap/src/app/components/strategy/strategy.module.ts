import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrategyRoutingModule } from './strategy-routing.module';
import { StrategyComponent } from './strategy.component';


@NgModule({
  declarations: [
    StrategyComponent
  ],
  imports: [
    CommonModule,
    StrategyRoutingModule
  ]
})
export class StrategyModule { }
