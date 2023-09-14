import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full'},
  { path: 'landing-page', loadChildren: () => import('./pages/landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  /* { path: 'strategy', loadChildren: () => import('./components/strategy/strategy.module').then(m => m.StrategyModule) }, */
  /* { path: 'swapV2', loadChildren: () => import('./components/swap-v2/swap-v2.module').then(m => m.SwapV2Module) } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
