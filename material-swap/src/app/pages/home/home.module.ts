import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { FormsModule } from '@angular/forms';
import { MetamaskIconComponent } from './../../components/metamask-icon/metamask-icon.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardProfileComponent } from 'src/app/components/card-profile/card-profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    MetamaskIconComponent,
    CardProfileComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgbDropdownModule,

  ]
})
export class HomeModule { }
