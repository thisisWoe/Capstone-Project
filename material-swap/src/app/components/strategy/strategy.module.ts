import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { StrategyRoutingModule } from './strategy-routing.module';
import { StrategyComponent } from './strategy.component';
import { ChartComponent } from '../chart/chart.component';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    StrategyComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    StrategyRoutingModule,
    FormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
    JsonPipe
  ]
})
export class StrategyModule { }
