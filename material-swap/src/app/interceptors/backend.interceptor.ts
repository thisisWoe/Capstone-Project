import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { MarketDataService } from '../market-data.service';
import { environment } from 'src/environments/environment.development';
import { AuthService } from '../auth.service';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  modifiedRequest!: HttpRequest<unknown>;

  constructor(private mktSvc: MarketDataService, private AuthService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verifico se l'URL della richiesta inizia con l'URL dell'API del mio backend
    if (request.url.startsWith('http://localhost:8080/api/')) {
      // Sottoscrizione all'observable dell'utente e gestione della richiesta con l'header di autorizzazione
      return this.AuthService.user$.pipe(take(1), switchMap(user => {
        if (!user) {
          // Se non c'è un utente loggato, gestisco la richiesta senza l'header di autorizzazione
          return next.handle(request)
        }
        // Clono la richiesta originale e aggiungo l'header di autorizzazione con il token JWT dell'utente
        const newReq = request.clone({
          headers: request.headers.append('Authorization', `Bearer ${user.accessToken}`)
        })
        return next.handle(newReq)
      }));

    } else {
      // Se l'URL della richiesta non inizia con l'URL dell'API locale, gestisco la richiesta senza modifiche
      return next.handle(request);
    }
  }
}
