import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SwapComponent } from 'src/app/components/swap/swap.component';

import { FormsModule } from '@angular/forms'; // Importa FormsModule



@NgModule({
  declarations: [
    HomeComponent,
    SwapComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ]
})
export class HomeModule { }
