import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbAlertModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
/* import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; */

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbDropdownModule,
    /* NgbModule */

  ]
})
export class DashboardModule { }
