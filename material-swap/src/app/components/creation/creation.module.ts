import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreationRoutingModule } from './creation-routing.module';
import { CreationComponent } from './creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreationComponent
  ],
  imports: [
    CommonModule,
    CreationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CreationModule { }
