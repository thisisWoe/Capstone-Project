import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MarketInterceptor } from './interceptors/market-data-interceptor/market-interceptor.interceptor';
import { CardProfileComponent } from './components/card-profile/card-profile.component';
import { BackendInterceptor } from './interceptors/backend.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: MarketInterceptor,
    multi: true
    },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
