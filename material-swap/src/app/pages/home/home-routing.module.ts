import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent,
  children:[
    { path: '', loadChildren: () => import('./../../components/swap-v2/swap-v2.module').then(m => m.SwapV2Module) },
    { path: 'swap-v2', loadChildren: () => import('./../../components/swap-v2/swap-v2.module').then(m => m.SwapV2Module) },
    { path: 'strategy', loadChildren: () => import('./../../components/strategy/strategy.module').then(m => m.StrategyModule), canActivate: [AuthGuard]   },
    { path: 'auth', loadChildren: () => import('./../../components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'dashboard', loadChildren: () => import('./../../components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]  },
    { path: 'admin', loadChildren: () => import('./../../components/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard]   },
    { path: 'gallery', loadChildren: () => import('./../../components/gallery/gallery.module').then(m => m.GalleryModule) },
    { path: 'creation', loadChildren: () => import('./../../components/creation/creation.module').then(m => m.CreationModule) },
  ]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
