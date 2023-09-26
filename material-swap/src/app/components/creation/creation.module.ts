import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreationRoutingModule } from './creation-routing.module';
import { CreationComponent } from './creation.component';


@NgModule({
  declarations: [
    CreationComponent
  ],
  imports: [
    CommonModule,
    CreationRoutingModule
  ]
})
export class CreationModule { }
