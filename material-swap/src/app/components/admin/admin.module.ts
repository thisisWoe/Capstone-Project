import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    FormsModule,
    JsonPipe,
    NgbModule,
    NgbDropdownModule
  ]
})
export class AdminModule { }
