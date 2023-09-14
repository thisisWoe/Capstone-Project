import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwapV2RoutingModule } from './swap-v2-routing.module';
import { SwapV2Component } from './swap-v2.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SwapV2Component
  ],
  imports: [
    CommonModule,
    SwapV2RoutingModule,
    FormsModule
  ]
})
export class SwapV2Module { }
