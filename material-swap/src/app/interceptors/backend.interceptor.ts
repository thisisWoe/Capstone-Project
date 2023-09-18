import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketDataService } from '../market-data.service';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  modifiedRequest!: HttpRequest<unknown>;

  constructor(private mktSvc: MarketDataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith('http://localhost:8080/api/')) {
      console.log('interceptor funziona');
      //da sotituire
      const accessToken = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIweGNCOThBODgyMjYxRTkwMGY2OGUzRDRmNTE0MzcyYTI1QWI2QWE4NDciLCJpYXQiOjE2OTUwNDk2MDAsImV4cCI6MTY5NTkxMzYwMH0.HWdznv_gTLuH_77NDhhW0df98aqJd5FrK-8bFH09BKw6CdBx2TNJeoecGVZZ_i1U';
      this.modifiedRequest = request.clone({
        headers:request.headers.append('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(this.modifiedRequest);
    } else {
      return next.handle(request);
    }
  }
}
