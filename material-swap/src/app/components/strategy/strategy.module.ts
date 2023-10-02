import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { StrategyRoutingModule } from './strategy-routing.module';
import { StrategyComponent } from './strategy.component';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    StrategyComponent,
  ],
  imports: [
    CommonModule,
    StrategyRoutingModule,
    FormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
    JsonPipe,
    NgbDropdownModule
  ]
})
export class StrategyModule { }
