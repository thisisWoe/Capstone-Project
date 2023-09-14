import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrategyRoutingModule } from './strategy-routing.module';
import { StrategyComponent } from './strategy.component';
import { ChartComponent } from '../chart/chart.component';


@NgModule({
  declarations: [
    StrategyComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    StrategyRoutingModule
  ]
})
export class StrategyModule { }
