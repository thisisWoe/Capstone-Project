import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SwapV2Component } from 'src/app/components/swap-v2/swap-v2.component';

/* const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '',
    redirectTo: 'swapV2',
    pathMatch: 'full',
    children: [
      { path: '', redirectTo: 'swapV2', pathMatch: 'full' },
      { path: 'swapV2', loadChildren: () => import('./../../components/swap-v2/swap-v2.module').then(m => m.SwapV2Module) }
    ]
  },
  { path: 'swapV2', loadChildren: () => import('./../../components/swap-v2/swap-v2.module').then(m => m.SwapV2Module) }
]; */
const routes: Routes = [
  { path: '', component: HomeComponent,
  children:[
    //{ path: '', component: SwapV2Component},
    { path: '', loadChildren: () => import('./../../components/swap-v2/swap-v2.module').then(m => m.SwapV2Module) },
    { path: 'strategy', loadChildren: () => import('./../../components/strategy/strategy.module').then(m => m.StrategyModule) },
  ]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
