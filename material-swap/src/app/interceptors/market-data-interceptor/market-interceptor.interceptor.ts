import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketDataService } from 'src/app/market-data.service';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class MarketInterceptor implements HttpInterceptor {
  modifiedRequest!: HttpRequest<unknown>;

  constructor(private mktSvc: MarketDataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verifico se l'URL della richiesta inizia con l'URL del servizio Coin API
    if (request.url.startsWith(environment.coinApi_url)) {
      // Clono la richiesta originale e aggiungo l'header di autorizzazione X-CoinAPI-Key con la chiave API fornita dal servizio
      this.modifiedRequest = request.clone({
        headers:request.headers.append('X-CoinAPI-Key',`${environment.api_key_coinApi}`)
      });
      return next.handle(this.modifiedRequest);
    } else {
      return next.handle(request);
    }
  }
}
