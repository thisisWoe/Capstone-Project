import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SwapComponent } from 'src/app/components/swap/swap.component';

import { FormsModule } from '@angular/forms';
import { MetamaskIconComponent } from './../../components/metamask-icon/metamask-icon.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CardProfileComponent } from 'src/app/components/card-profile/card-profile.component';




@NgModule({
  declarations: [
    HomeComponent,
    SwapComponent,
    MetamaskIconComponent,
    CardProfileComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgbDropdownModule
  ]
})
export class HomeModule { }
