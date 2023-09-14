import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwapV2Component } from './swap-v2.component';

const routes: Routes = [{ path: '', component: SwapV2Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwapV2RoutingModule { }
